declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

declare module "@env";
declare module '@zegocloud/zego-uikit-prebuilt-call-rn';