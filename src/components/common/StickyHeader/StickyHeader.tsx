import React, { ReactElement } from "react";

type StickyHeaderProps = {
  title: string;
  description?: string;
};
const StickyHeader = ({
  title,
  description,
}: StickyHeaderProps): ReactElement => {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};
export default StickyHeader;
