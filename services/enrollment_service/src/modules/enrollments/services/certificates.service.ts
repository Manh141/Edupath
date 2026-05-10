import { Injectable } from '@nestjs/common';

@Injectable()
export class CertificatesService {
  buildCertificateCode(seed: string): string {
    return `CERT-${seed.slice(-8).toUpperCase()}-${Date.now().toString().slice(-6)}`;
  }
}
