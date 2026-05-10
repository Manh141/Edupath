"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { instructorApi } from "@/lib/course-api";
import type {
  Course,
  CourseLecture,
  CourseSection,
  LectureType,
  ReorderItem,
} from "@/types/course";
import { AssetUploader } from "../AssetUploader";

const LECTURE_TYPE_LABELS: Record<LectureType, string> = {
  video: "Video",
  article: "Article",
  resource: "Resource",
};

export function CurriculumStep({
  course,
  editable,
  onChanged,
  onPrev,
  onNext,
}: {
  course: Course;
  editable: boolean;
  onChanged: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const sections = course.sections ?? [];

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: ["instructor-course", course.id],
    });
    onChanged();
  };

  const createSectionMutation = useMutation({
    mutationFn: (title: string) =>
      instructorApi.createSection(course.id, { title }, accessToken!),
    onSuccess: () => {
      toast.success("Section created.");
      setNewSectionTitle("");
      invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to create section.",
      ),
  });

  const reorderSectionsMutation = useMutation({
    mutationFn: (items: ReorderItem[]) =>
      instructorApi.reorderSections(course.id, items, accessToken!),
    onSuccess: () => {
      toast.success("Section order updated.");
      invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to reorder sections.",
      ),
  });

  const moveSection = (sectionId: string, delta: -1 | 1) => {
    if (reorderSectionsMutation.isPending) return;
    const index = sections.findIndex((section) => section.id === sectionId);
    const next = moveItem(sections, index, delta);
    if (!next) return;
    reorderSectionsMutation.mutate(toOrderPayload(next));
  };

  const addSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    createSectionMutation.mutate(title);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-black text-brand">
              Curriculum builder
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create sections, lectures and attach real content. The checklist
              needs at least 1 section, 5 lectures and 30 minutes of video
              content.
            </p>
          </div>
          {!editable && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Lock className="h-3.5 w-3.5" />
              Locked in current status
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionCard
            key={`${section.id}-${section.updatedAt ?? ""}-${section.title}-${section.lectures?.length ?? 0}`}
            courseId={course.id}
            section={section}
            sectionIndex={index}
            totalSections={sections.length}
            editable={editable}
            accessToken={accessToken}
            onChanged={invalidate}
            onMove={moveSection}
            isReordering={reorderSectionsMutation.isPending}
          />
        ))}

        {sections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Video className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-heading text-lg font-bold text-brand">
              Start with your first section
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              A clear curriculum makes review easier and gives students
              confidence before they enroll.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={newSectionTitle}
              placeholder="New section title"
              disabled={!editable}
              onChange={(event) => setNewSectionTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSection();
                }
              }}
            />
            <Button
              type="button"
              variant="hero"
              disabled={
                !editable ||
                !newSectionTitle.trim() ||
                createSectionMutation.isPending
              }
              onClick={addSection}
            >
              {createSectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add section
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to learners
        </Button>
        <Button type="button" variant="outline" onClick={onNext}>
          Continue to media
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  sectionIndex,
  totalSections,
  editable,
  accessToken,
  onChanged,
  onMove,
  isReordering,
}: {
  courseId: string;
  section: CourseSection;
  sectionIndex: number;
  totalSections: number;
  editable: boolean;
  accessToken: string | null;
  onChanged: () => void;
  onMove: (sectionId: string, delta: -1 | 1) => void;
  isReordering: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description ?? "");
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [newLectureType, setNewLectureType] = useState<LectureType>("video");

  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: ["instructor-course", section.courseId],
    });
    onChanged();
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      instructorApi.updateSection(
        section.id,
        { title: title.trim(), description: description.trim() },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Section saved.");
      invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to save section.",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: () => instructorApi.deleteSection(section.id, accessToken!),
    onSuccess: () => {
      toast.success("Section deleted.");
      invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to delete section.",
      ),
  });

  const createLectureMutation = useMutation({
    mutationFn: () =>
      instructorApi.createLecture(
        section.id,
        {
          title: newLectureTitle.trim(),
          type: newLectureType,
          articleContent: newLectureType === "article" ? "" : undefined,
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Lecture added.");
      setNewLectureTitle("");
      invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to add lecture.",
      ),
  });

  const reorderLecturesMutation = useMutation({
    mutationFn: (items: ReorderItem[]) =>
      instructorApi.reorderLectures(section.id, items, accessToken!),
    onSuccess: () => {
      toast.success("Lecture order updated.");
      invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to reorder lectures.",
      ),
  });

  const lectures = section.lectures ?? [];

  const moveLecture = (lectureId: string, delta: -1 | 1) => {
    if (reorderLecturesMutation.isPending) return;
    const index = lectures.findIndex((lecture) => lecture.id === lectureId);
    const next = moveItem(lectures, index, delta);
    if (!next) return;
    reorderLecturesMutation.mutate(toOrderPayload(next));
  };

  const addLecture = () => {
    if (!newLectureTitle.trim()) return;
    createLectureMutation.mutate();
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex flex-wrap items-center gap-3 border-b border-border bg-secondary/50 p-4">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-background px-2 text-xs font-bold text-brand"
          aria-label={`Section ${sectionIndex + 1}`}
        >
          {sectionIndex + 1}
        </span>
        <div className="min-w-[220px] flex-1">
          <Input
            value={title}
            disabled={!editable}
            onChange={(event) => setTitle(event.target.value)}
            className="h-9 bg-background font-heading font-semibold"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {lectures.length} lecture{lectures.length === 1 ? "" : "s"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!editable || isReordering || sectionIndex === 0}
          onClick={() => onMove(section.id, -1)}
          aria-label="Move section up"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={
            !editable || isReordering || sectionIndex === totalSections - 1
          }
          onClick={() => onMove(section.id, 1)}
          aria-label="Move section down"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!editable || updateMutation.isPending || !title.trim()}
          onClick={() => updateMutation.mutate()}
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!editable || deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
          aria-label="Delete section"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setExpanded((value) => !value)}
          aria-label="Toggle section"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </header>

      {expanded && (
        <div className="space-y-4 p-4">
          <Textarea
            value={description}
            disabled={!editable}
            placeholder="Optional section description"
            className="min-h-20"
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="space-y-3">
            {lectures.map((lecture, index) => (
              <LectureEditor
                key={`${lecture.id}-${lecture.updatedAt ?? ""}-${lecture.title}-${lecture.type}-${lecture.assets?.length ?? 0}`}
                lecture={lecture}
                lectureIndex={index}
                totalLectures={lectures.length}
                editable={editable}
                accessToken={accessToken}
                onChanged={onChanged}
                onMove={moveLecture}
                isReordering={reorderLecturesMutation.isPending}
              />
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-background p-3">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <Input
                value={newLectureTitle}
                disabled={!editable}
                placeholder="New lecture title"
                onChange={(event) => setNewLectureTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addLecture();
                  }
                }}
              />
              <Select
                value={newLectureType}
                onValueChange={(value) =>
                  setNewLectureType(value as LectureType)
                }
                disabled={!editable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lecture type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="hero"
                disabled={
                  !editable ||
                  !newLectureTitle.trim() ||
                  createLectureMutation.isPending
                }
                onClick={addLecture}
              >
                {createLectureMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add lecture
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function LectureEditor({
  lecture,
  lectureIndex,
  totalLectures,
  editable,
  accessToken,
  onChanged,
  onMove,
  isReordering,
}: {
  lecture: CourseLecture;
  lectureIndex: number;
  totalLectures: number;
  editable: boolean;
  accessToken: string | null;
  onChanged: () => void;
  onMove: (lectureId: string, delta: -1 | 1) => void;
  isReordering: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [type, setType] = useState<LectureType>(lecture.type ?? "video");
  const [durationSec, setDurationSec] = useState(
    String(lecture.durationSec ?? 0),
  );
  const [videoUrl, setVideoUrl] = useState(lecture.videoUrl ?? "");
  const [articleContent, setArticleContent] = useState(
    lecture.articleContent ?? "",
  );
  const [description, setDescription] = useState(lecture.description ?? "");

  const updateMutation = useMutation({
    mutationFn: () =>
      instructorApi.updateLecture(
        lecture.id,
        {
          title: title.trim(),
          type,
          durationSec: Number(durationSec) || 0,
          videoUrl: type === "video" ? videoUrl.trim() : undefined,
          articleContent:
            type === "article" ? articleContent.trim() : undefined,
          description: description.trim(),
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Lecture saved.");
      onChanged();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to save lecture.",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: () => instructorApi.deleteLecture(lecture.id, accessToken!),
    onSuccess: () => {
      toast.success("Lecture deleted.");
      onChanged();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to delete lecture.",
      ),
  });

  const handleVideoUpload = async (
    file: File,
    opts: { onProgress: (loaded: number, total: number) => void },
  ) => {
    const detectedDurationSec = await getVideoDurationSec(file);
    setDurationSec(String(detectedDurationSec));

    const result = await instructorApi.uploadLectureVideo(
      lecture.id,
      file,
      accessToken!,
      {
        durationSec: detectedDurationSec,
        name: file.name,
        onProgress: opts.onProgress,
      },
    );

    setDurationSec(String(result.lecture.durationSec ?? detectedDurationSec));
    setVideoUrl(result.lecture.videoUrl ?? "");
    toast.success(
      `Lecture video uploaded (${formatDuration(result.lecture.durationSec ?? detectedDurationSec)}).`,
    );
    onChanged();
  };

  const handleResourceUpload = async (
    file: File,
    opts: { onProgress: (loaded: number, total: number) => void },
  ) => {
    await instructorApi.uploadLectureResource(lecture.id, file, accessToken!, {
      name: file.name,
      onProgress: opts.onProgress,
    });
    toast.success("Resource uploaded.");
    onChanged();
  };

  const assets = lecture.assets ?? [];
  const TypeIcon = type === "video" ? Video : FileText;

  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <TypeIcon className="h-4 w-4 text-muted-foreground" />
        <span
          className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-card px-2 text-xs font-bold text-brand"
          aria-label={`Lecture ${lectureIndex + 1}`}
        >
          {lectureIndex + 1}
        </span>
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setExpanded((value) => !value)}
        >
          <p className="truncate text-sm font-semibold text-foreground">
            {lecture.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {LECTURE_TYPE_LABELS[type]} -{" "}
            {formatDuration(lecture.durationSec ?? 0)} - {assets.length} asset
            {assets.length === 1 ? "" : "s"}
          </p>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!editable || isReordering || lectureIndex === 0}
          onClick={() => onMove(lecture.id, -1)}
          aria-label="Move lecture up"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={
            !editable || isReordering || lectureIndex === totalLectures - 1
          }
          onClick={() => onMove(lecture.id, 1)}
          aria-label="Move lecture down"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setExpanded((value) => !value)}
          aria-label="Toggle lecture"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_170px_150px]">
            <Input
              value={title}
              disabled={!editable}
              placeholder="Lecture title"
              onChange={(event) => setTitle(event.target.value)}
            />
            <Select
              value={type}
              onValueChange={(value) => setType(value as LectureType)}
              disabled={!editable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Lecture type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              value={durationSec}
              disabled={!editable}
              placeholder="Duration sec"
              onChange={(event) => setDurationSec(event.target.value)}
            />
          </div>

          <Textarea
            value={description}
            disabled={!editable}
            placeholder="Lecture description"
            className="min-h-20"
            onChange={(event) => setDescription(event.target.value)}
          />

          {type === "video" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Video URL
                </p>
                <Input
                  value={videoUrl}
                  disabled={!editable}
                  placeholder="Storage URL is filled automatically after upload"
                  onChange={(event) => setVideoUrl(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Uploading through EduPath stores metadata and updates this
                  URL.
                </p>
              </div>
              <AssetUploader
                label="Upload lecture video"
                description="MP4, WebM or MOV. Duration should match the final video."
                accept="video/mp4,video/webm,video/quicktime"
                maxBytes={5 * 1024 * 1024 * 1024}
                disabled={!editable}
                previewUrl={videoUrl || lecture.videoUrl}
                previewKind="video"
                onUpload={handleVideoUpload}
              />
            </div>
          )}

          {type === "article" && (
            <Textarea
              value={articleContent}
              disabled={!editable}
              placeholder="Write the article lesson content here."
              className="min-h-44"
              onChange={(event) => setArticleContent(event.target.value)}
            />
          )}

          {type === "resource" && (
            <AssetUploader
              label="Upload lecture resource"
              description="PDF, slide decks, zip files or supporting material."
              accept=".pdf,.zip,.doc,.docx,.ppt,.pptx,.xlsx,.csv,text/plain,application/pdf"
              maxBytes={100 * 1024 * 1024}
              disabled={!editable}
              previewUrl={null}
              onUpload={handleResourceUpload}
            />
          )}

          {assets.length > 0 && (
            <div className="rounded-2xl bg-secondary/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attached assets
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {assets.map((asset) => (
                  <li
                    key={asset.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="truncate">{asset.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {asset.fileType}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!editable || updateMutation.isPending || !title.trim()}
              onClick={() => updateMutation.mutate()}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save lecture
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!editable || deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              Delete lecture
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function moveItem<T>(items: T[], index: number, delta: -1 | 1): T[] | null {
  const target = index + delta;
  if (index < 0 || target < 0 || target >= items.length) return null;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

function toOrderPayload(items: Array<{ id: string }>): ReorderItem[] {
  return items.map((item, index) => ({ id: item.id, order: index + 1 }));
}

function formatDuration(durationSec: number): string {
  const totalSec = Math.max(0, Math.round(durationSec));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

function getVideoDurationSec(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    let settled = false;
    let timeoutId: number | undefined;

    const cleanup = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      video.onloadedmetadata = null;
      video.ondurationchange = null;
      video.onerror = null;
      video.removeAttribute("src");
      URL.revokeObjectURL(objectUrl);
    };

    const settle = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };

    const readDuration = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const detectedDurationSec = Math.max(1, Math.round(video.duration));
      settle(() => resolve(detectedDurationSec));
    };

    video.preload = "metadata";
    video.onloadedmetadata = readDuration;
    video.ondurationchange = readDuration;
    video.onerror = () =>
      settle(() =>
        reject(
          new Error(
            "Could not read video duration. Please choose a valid MP4, WebM or MOV file.",
          ),
        ),
      );
    timeoutId = window.setTimeout(
      () =>
        settle(() =>
          reject(
            new Error(
              "Could not read video duration before upload. Please try the file again.",
            ),
          ),
        ),
      10000,
    );

    video.src = objectUrl;
  });
}
