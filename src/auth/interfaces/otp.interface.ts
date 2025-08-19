export interface IOtp {
  id: string;
  phone: string;
  hash: string;
  createdAt: Date;
}

export interface IOtpGet {
  phone: string;
}

export interface IOtpSet {
  phone: string;
  hash: string;
}

export interface IOtpSend {
  success?: boolean;
  message: string;
}
