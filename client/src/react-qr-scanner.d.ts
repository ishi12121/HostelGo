declare module "react-qr-scanner" {
  import { Component } from "react";

  interface QrReaderProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: { text: string } | null) => void;
    style?: React.CSSProperties;
    facingMode?: "user" | "environment";
    legacyMode?: boolean;
    maxImageSize?: number;
    className?: string;
  }

  class QrReader extends Component<QrReaderProps> {}

  export default QrReader;
}
