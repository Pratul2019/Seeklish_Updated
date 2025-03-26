"use client";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Rentalui from "./RentalUi";
import type { Rental } from "@/components/types";
import { Button } from "@/components/ui/button";
import ErrorComponent from "./error";

async function getrental(page = 1, limit = 10) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/Rentalfetch?page=${page}&limit=${limit}`
  );

  if (!response.data || !response.data.rentals) {
    throw new Error("Failed to fetch data");
  }

  return {
    rentals: response.data.rentals,
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
}

export default function Rental() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMoreRentals = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const { rentals: newRentals, totalPages } = await getrental(page);
      setRentals((prevRentals) => [...prevRentals, ...newRentals]);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load rentals'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreRentals(1);
  }, []);

  if (error) {
    return (
      <ErrorComponent 
        error={error} 
        reset={() => loadMoreRentals(1)} 
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:p-4 md:mx-4 mt-20 md:mt-0">
        {rentals.map((rental: Rental, index: number) => (
          <Fragment key={`${rental._id}-${index}`}>
            <Rentalui rental={rental} />
          </Fragment>
        ))}
      </div>
      <div className="flex items-center justify-center p-2 mb-4">
        {currentPage < totalPages && (
          <Button
            variant="default"
            onClick={() => loadMoreRentals(currentPage + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </>
  );
}