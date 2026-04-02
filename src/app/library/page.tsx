"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { PageHeader } from "@/components/PageHeader";

type Book = {
  title: string;
  author_name?: string[];
  cover_i?: number;
  key?: string;
  first_publish_year?: number;
  isbn?: string[];
  publisher?: string[];
  description?: string | { value?: string };
};

type ApiResponse = {
  docs: Book[];
};

export default function LibraryPage() {
  const [query, setQuery] = useState<string>("harry potter");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const searchBooks = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://openlibrary.org/search.json?q=${queryToSearch}`
      );

      const data: ApiResponse = await res.json();

      setBooks(data.docs.slice(0, 20));
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search when component mounts
  useEffect(() => {
    searchBooks(query);
  }, []);

  const fetchBookDetails = async (book: Book) => {
    try {
      setLoadingDetails(true);
      setSelectedBook(book);

      // Fetch full book details from Open Library
      if (book.key) {
        const res = await fetch(`https://openlibrary.org${book.key}.json`);
        const details = await res.json();
        setBookDetails(details);
      }
    } catch (err) {
      console.error("Error fetching book details:", err);
      setBookDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#111c2a] p-4 md:p-6 lg:p-8">
      <div className="bg-transparent w-full">
        <div className="flex flex-col h-full glass rounded-[2.5rem] overflow-hidden">
          <PageHeader 
            title="Online Library" 
            onSearch={(searchQuery) => {
              setQuery(searchQuery);
              searchBooks(searchQuery);
            }} 
          />

          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10">

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-white/60">Finding books...</span>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => fetchBookDetails(book)}
            >
              <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 relative">
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📖</div>
                      <p className="text-white/30 text-xs">No Cover</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">
                  {book.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-1">
                  {book.author_name?.[0] || "Unknown Author"}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-white/60 mb-4">No books found. Try searching for something!</p>
          </div>
        )}

        {/* Book Detail Modal */}
        {selectedBook && (
          <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white"></DialogTitle>
                <DialogClose className="text-white/60 hover:text-white" />
              </DialogHeader>

              <div className="flex gap-6">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  {selectedBook.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-M.jpg`}
                      alt={selectedBook.title}
                      className="w-32 h-48 object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📖</div>
                        <p className="text-white/30 text-xs">No Cover</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedBook.title}</h2>

                  {selectedBook.author_name && selectedBook.author_name.length > 0 && (
                    <p className="text-white/70 mb-4">
                      <span className="text-white/50">By: </span>
                      {selectedBook.author_name.join(", ")}
                    </p>
                  )}

                  {selectedBook.first_publish_year && (
                    <p className="text-white/70 mb-2">
                      <span className="text-white/50">Published: </span>
                      {selectedBook.first_publish_year}
                    </p>
                  )}

                  {selectedBook.publisher && selectedBook.publisher.length > 0 && (
                    <p className="text-white/70 mb-4">
                      <span className="text-white/50">Publisher: </span>
                      {selectedBook.publisher.join(", ")}
                    </p>
                  )}

                  {/* Description */}
                  {(bookDetails?.description || selectedBook.description) && (
                    <div className="mb-4">
                      <h3 className="text-white font-semibold mb-2">Description</h3>
                      <p className="text-white/60 text-sm line-clamp-4">
                        {typeof bookDetails?.description === "object" && bookDetails.description?.value
                          ? bookDetails.description.value
                          : typeof selectedBook.description === "object" && selectedBook.description?.value
                          ? selectedBook.description.value
                          : bookDetails?.description || selectedBook.description || "No description available"}
                      </p>
                    </div>
                  )}

                  {/* ISBN */}
                  {bookDetails?.isbn && bookDetails.isbn.length > 0 && (
                    <p className="text-white/70 text-sm mb-4">
                      <span className="text-white/50">ISBN: </span>
                      {bookDetails.isbn[0]}
                    </p>
                  )}

                  {/* Read Button */}
                  <Button
                    onClick={() => {
                      const readUrl = `https://openlibrary.org${selectedBook.key}/read`;
                      window.open(readUrl, "_blank");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mt-6"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read on Open Library
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}