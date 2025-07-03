import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMemo } from "react";

type TransactionsPaginationProps = {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const TransactionsPagination = ({
  page,
  totalPages,
  setPage,
}: TransactionsPaginationProps) => {
  const paginationRange = useMemo<(number | string)[]>(() => {
    const delta = 1; // how many pages around current
    const left = page - delta;
    const right = page + delta;
    const range: (number | string)[] = [];
    let last: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (last !== null && i - (last as number) > 1) {
          range.push("...");
        }
        range.push(i);
        last = i;
      }
    }
    return range;
  }, [page, totalPages]);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            // disabled={page === 1}
          />
        </PaginationItem>

        {paginationRange.map((item, idx) =>
          item === "..." ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={() => setPage(item as number)}
                isActive={page === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            // disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TransactionsPagination;
