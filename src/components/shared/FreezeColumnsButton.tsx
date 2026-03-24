/**
 * Reusable "Freeze Columns" toolbar button for master screens.
 * Use with useFreezeColumns hook and FreezeColumnsDialog.
 */
import { Button, ButtonProps } from "@mui/material";
import { ViewColumn as ViewColumnIcon } from "@mui/icons-material";

export interface FreezeColumnsButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void;
  disabled?: boolean;
  /** Optional styled Button component (e.g. StyledSecondaryButton) */
  component?: React.ElementType;
}

export function FreezeColumnsButton({
  onClick,
  disabled = false,
  component: Component = Button,
  ...buttonProps
}: FreezeColumnsButtonProps) {
  return (
    <Component
      variant="outlined"
      size="small"
      startIcon={<ViewColumnIcon />}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      Freeze Columns
    </Component>
  );
}
