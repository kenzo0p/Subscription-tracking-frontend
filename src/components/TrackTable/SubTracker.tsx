import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Checkbox } from "../../components/ui/checkbox";

import {
  MoreVertical,
  Plus,
  Search,
  ChevronDown,
  CalendarIcon,
  CreditCard,
  Tag,
  Star,
  X,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { ModeToggle } from "../mode-toggle";

// Helper function to capitalize first letter
export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "FREQUENCY", uid: "frequency", sortable: true },
  { name: "START DATE", uid: "startDate", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Cancelled", uid: "cancelled" },
  { name: "Expired", uid: "expired" },
];

export const categoryOptions = [
  { name: "Entertainment", uid: "entertainment" },
  { name: "Sports", uid: "sports" },
  { name: "News", uid: "news" },
  { name: "Lifestyle", uid: "lifestyle" },
  { name: "Technology", uid: "technology" },
  { name: "Finance", uid: "finance" },
  { name: "Politics", uid: "politics" },
  { name: "Other", uid: "other" },
];

export const currencySymbols: Record<string, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
};

export const subscriptions = [
  {
    id: 1,
    name: "Amazon Premium",
    price: 15.59,
    currency: "USD",
    frequency: "monthly",
    category: "entertainment",
    startDate: "2025-02-11T00:00:00.000Z",
    paymentMethod: "Credit Card",
    status: "active",
  },
  {
    id: 2,
    name: "Netflix Standard",
    price: 15.49,
    currency: "USD",
    frequency: "monthly",
    category: "entertainment",
    startDate: "2025-01-15T00:00:00.000Z",
    paymentMethod: "PayPal",
    status: "active",
  },
  {
    id: 3,
    name: "WSJ Digital",
    price: 39.99,
    currency: "USD",
    frequency: "yearly",
    category: "news",
    startDate: "2025-03-01T00:00:00.000Z",
    paymentMethod: "Credit Card",
    status: "active",
  },
  {
    id: 4,
    name: "Spotify Premium",
    price: 9.99,
    currency: "USD",
    frequency: "monthly",
    category: "entertainment",
    startDate: "2024-12-01T00:00:00.000Z",
    paymentMethod: "Debit Card",
    status: "active",
  },
  {
    id: 5,
    name: "Apple News+",
    price: 9.99,
    currency: "USD",
    frequency: "monthly",
    category: "news",
    startDate: "2025-02-01T00:00:00.000Z",
    paymentMethod: "Apple Pay",
    status: "expired",
  },
  {
    id: 6,
    name: "LinkedIn Premium",
    price: 29.99,
    currency: "USD",
    frequency: "monthly",
    category: "professional",
    startDate: "2025-01-20T00:00:00.000Z",
    paymentMethod: "Credit Card",
    status: "cancelled",
  },
];

const statusColorMap: Record<string, string> = {
  active: "success",
  cancelled: "destructive",
  expired: "yellow",
};

export default function SubscriptionTrackingTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedSubscriptions, setSelectedSubscriptions] = React.useState<
    number[]
  >([]);
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([
    "name",
    "price",
    "category",
    "frequency",
    "startDate",
    "status",
    "actions",
  ]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortColumn, setSortColumn] = React.useState("startDate");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );

  // Filter subscriptions based on search, status, and category
  const filteredSubscriptions = React.useMemo(() => {
    let filtered = [...subscriptions];

    if (filterValue) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          sub.category.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((sub) => statusFilter.includes(sub.status));
    }

    if (categoryFilter.length > 0) {
      filtered = filtered.filter((sub) =>
        categoryFilter.includes(sub.category)
      );
    }

    // Sort subscriptions
    filtered.sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      // Special handling for dates
      if (sortColumn === "startDate") {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Special handling for price
      if (sortColumn === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      }

      // Default string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  }, [filterValue, statusFilter, categoryFilter, sortColumn, sortDirection]);

  // Paginate subscriptions
  const paginatedSubscriptions = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredSubscriptions.slice(start, end);
  }, [filteredSubscriptions, currentPage, rowsPerPage]);

  // Total pages
  const totalPages = Math.ceil(filteredSubscriptions.length / rowsPerPage);

  // Toggle subscription selection
  const toggleSubscriptionSelection = (subId: number) => {
    setSelectedSubscriptions((prev) => {
      if (prev.includes(subId)) {
        return prev.filter((id) => id !== subId);
      } else {
        return [...prev, subId];
      }
    });
  };

  // Toggle all subscriptions selection
  const toggleAllSubscriptions = () => {
    if (selectedSubscriptions.length === paginatedSubscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(paginatedSubscriptions.map((sub) => sub.id));
    }
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="space-y-4">
      {/* Table controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative gap-2 flex w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            className="pl-8"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <ModeToggle/>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div>
            <Button variant="outline" size="sm" className="h-8">
              Reset <X />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status.uid}
                  className="flex items-center gap-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleStatusFilter(status.uid);
                  }}
                >
                  <Checkbox
                    checked={statusFilter.includes(status.uid)}
                    className="h-4 w-4"
                  />
                  <span>{status.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Category <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {categoryOptions.map((category) => (
                <DropdownMenuItem
                  key={category.uid}
                  className="flex items-center gap-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleCategoryFilter(category.uid);
                  }}
                >
                  <Checkbox
                    checked={categoryFilter.includes(category.uid)}
                    className="h-4 w-4"
                  />
                  <span>{category.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {columns.map((column) => (
                <DropdownMenuItem
                  key={column.uid}
                  className="flex items-center gap-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    setVisibleColumns((prev) => {
                      if (prev.includes(column.uid)) {
                        return prev.filter((c) => c !== column.uid);
                      } else {
                        return [...prev, column.uid];
                      }
                    });
                  }}
                >
                  <Checkbox
                    checked={visibleColumns.includes(column.uid)}
                    className="h-4 w-4"
                  />
                  <span>{column.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="default" size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" /> Add Subscription
          </Button>
        </div>
      </div>

      {/* Table container */}
      <div className="relative border rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] px-2 whitespace-nowrap sticky left-0  z-20">
                  <Checkbox
                    checked={
                      selectedSubscriptions.length ===
                        paginatedSubscriptions.length &&
                      paginatedSubscriptions.length > 0
                    }
                    onCheckedChange={toggleAllSubscriptions}
                    aria-label="Select all"
                  />
                </TableHead>
                {visibleColumns.includes("name") && (
                  <TableHead className="w-[180px] px-2 whitespace-nowrap sticky left-[40px]  z-20">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("name")}
                    >
                      <Star className="h-4 w-4 mr-1 hidden lg:block" />
                      Name
                      {sortColumn === "name" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TableHead>
                )}
                {visibleColumns.includes("price") && (
                  <TableHead className="w-[100px] whitespace-nowrap">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("price")}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Price
                      {sortColumn === "price" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TableHead>
                )}
                {visibleColumns.includes("category") && (
                  <TableHead className="hidden md:table-cell w-[120px] whitespace-nowrap">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("category")}
                    >
                      Category
                      {sortColumn === "category" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TableHead>
                )}
                {visibleColumns.includes("frequency") && (
                  <TableHead className="hidden md:table-cell w-[100px] whitespace-nowrap">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("frequency")}
                    >
                      Frequency
                      {sortColumn === "frequency" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TableHead>
                )}
                {visibleColumns.includes("startDate") && (
                  <TableHead className="hidden md:table-cell w-[120px] whitespace-nowrap">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("startDate")}
                    >
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Start Date
                      {sortColumn === "startDate" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TableHead>
                )}
                {visibleColumns.includes("status") && (
                  <TableHead className="hidden md:table-cell w-[120px] whitespace-nowrap">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      {sortColumn === "status" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TableHead>
                )}
                {visibleColumns.includes("actions") && (
                  <TableHead className="hidden md:table-cell w-[80px] text-right whitespace-nowrap">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + 1}
                    className="h-24 text-center"
                  >
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="px-2 sticky left-0  z-20">
                      <Checkbox
                        checked={selectedSubscriptions.includes(sub.id)}
                        onCheckedChange={() =>
                          toggleSubscriptionSelection(sub.id)
                        }
                        aria-label={`Select subscription for ${sub.name}`}
                      />
                    </TableCell>
                    {visibleColumns.includes("name") && (
                      <TableCell className="px-2 sticky left-[40px] z-20 font-medium">
                        {sub.name}
                      </TableCell>
                    )}
                    {visibleColumns.includes("price") && (
                      <TableCell className="px-2">
                        <span className="font-medium">
                          {currencySymbols[sub.currency]}
                          {sub.price}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.includes("category") && (
                      <TableCell className="hidden md:table-cell capitalize">
                        {sub.category}
                      </TableCell>
                    )}
                    {visibleColumns.includes("frequency") && (
                      <TableCell className="hidden md:table-cell capitalize">
                        {sub.frequency}
                      </TableCell>
                    )}
                    {visibleColumns.includes("startDate") && (
                      <TableCell className="hidden md:table-cell">
                        {formatDate(sub.startDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("status") && (
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            statusColorMap[sub.status] === "success"
                              ? "default"
                              : "outline"
                          }
                          className={`
                            ${
                              statusColorMap[sub.status] === "success"
                                ? ""
                                : statusColorMap[sub.status] === "destructive"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            } 
                            capitalize w-fit inline-flex items-center
                          `}
                        >
                          {sub.status === "active" && (
                            <Check className="mr-1 h-3 w-3" />
                          )}
                          {sub.status === "cancelled" && (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {sub.status === "expired" && (
                            <CalendarIcon className="mr-1 h-3 w-3" />
                          )}
                          {capitalize(sub.status)}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes("actions") && (
                      <TableCell className="hidden md:table-cell text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div>
            {selectedSubscriptions.length} of {filteredSubscriptions.length}{" "}
            selected
          </div>
          <div className="flex items-center gap-1">
            <span>Rows per page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPages > 5 && (
              <>
                <PaginationItem>
                  <span className="pointer-events-none opacity-50">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
