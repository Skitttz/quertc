type DeviceType = "desktop" | "mobile";

interface IHeaderRenderProps {
  isSticky: boolean;
  isMenuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  handleLinkClick: () => void;
}

export type { DeviceType, IHeaderRenderProps };
