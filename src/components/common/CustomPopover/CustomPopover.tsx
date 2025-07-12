import React, { ReactElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CustomPopoverProps = {
  trigger: ReactElement;
  content: ReactElement;
  triggerProps?: React.ComponentProps<typeof PopoverTrigger>;
  contentProps?: React.ComponentProps<typeof PopoverContent>;
};

const CustomPopover = ({
  trigger,
  content,
  triggerProps,
  contentProps,
}: CustomPopoverProps): ReactElement => {
  return (
    <Popover>
      <PopoverTrigger asChild {...triggerProps}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent {...contentProps}>{content}</PopoverContent>
    </Popover>
  );
};
export default CustomPopover;
