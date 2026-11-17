import { useEffect, useState, useContext, useReducer } from "react";

import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import Header from "./Header.jsx";
import Panel from "./Panel.jsx";
import BookCard from "./BookCard.jsx";
import NowReading from "./NowReading.jsx";
import SearchBox from "./SearchBox.jsx";
import AddBook from "./AddBook.jsx";
import ShelfBody from "./ShelfBody.jsx";
import { BookContext } from "../context/BookProvider.jsx";
import Pager from './Pager.jsx';
import { viewReducer, initialState } from '../state/viewReducer.js';

const PAGE_SIZE = 5;

function Shelf() {
    const [state, dispatch] = useReducer(viewReducer, initialState);
    console.log(state);

    let after = viewReducer(state, { type: "toggle_hide" })
    console.log(after);

    after = viewReducer(after, { type: "query_changed", query: "hunger" });
    console.log(after);

    const { 
        data: books, 
        setData: setBooks, 
        loading, error, retry } = useContext(BookContext);

    const [page, setPage] = useState(1);
    const [hideFinished, setHideFinished] = useState(false);
    const [query, setQuery] = useState("");
    const [currentId, setCurrentId] = useState(null);

    const settled = useDebouncedValue(query, 300);

    function changeStatus(id, status) {
        setBooks(
            books.map((book) => (book.id === id ? { ...book, status } : book))
        );

        if (status === "reading") {
            setCurrentId(id);
        } else if (id === currentId) {
            setCurrentId(null);
        }
    }

    function addBook(title) {
        const book = {
            id: crypto.randomUUID(),
            title,
            author: "Unknown author",
            status: "want",
            tags: [],
        };

        setBooks([...books, book]);
    }

    const matching = books.filter((book) =>
        book.title.toLowerCase().includes(settled.toLowerCase())
    );
    const shown = hideFinished
        ? matching.filter((book) => book.status !== "finished")
        : matching;
    const current = books.find((book) => book.id === currentId);

    const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
    const visible = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // const reading = shown.filter((book) => book.status === "reading");
    // const want = shown.filter((book) => book.status === "want");
    // const finished = shown.filter((book) => book.status === "finished");
    // const abandoned = shown.filter((book) => book.status === "abandoned");

    const finishedCount = books.filter((b) => b.status === "finished").length;

    useEffect(() => {
        document.title =
            query === ""
                ? `Shelf — ${shown.length} books`
                : `Shelf — ${shown.length} of ${books.length} shown`;
    }, [shown.length, books.length, query]);

    useEffect(() => {
        function handleKeyDown(event) {
            const typing = event.target.closest?.("input, textarea, select");
            if (typing) return;

            if (event.key === "f") {
                setHideFinished((on) => !on);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    function cards(list) {
        return list.map((book) => (
            <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                status={book.status}
                rating={book.rating}
                tags={book.tags}
                notes={book.notes}
                onStatusChange={(next) => changeStatus(book.id, next)}
            />
        ));
    }

    return (
        <>
            <Header
                owner="Josh"
                bookCount={books.length}
                finishedCount={finishedCount}
                hideFinished={hideFinished}
                onHideFinishedChange={setHideFinished}
            />

            <NowReading book={current} />
            <SearchBox value={query} onChange={setQuery} />
            <AddBook onAdd={addBook} />
            <Pager page={page} pageCount={pageCount} onChange={setPage} />

            <ShelfBody
                loading={loading}
                error={error}
                books={books}
                onRetry={retry}
            >
                {/*<Panel title="Currently reading">{cards(reading)}</Panel>
                <Panel title="Want to read">{cards(want)}</Panel>
                <Panel title="Finished">{cards(finished)}</Panel>
                <Panel title="Gave up on">{cards(abandoned)}</Panel>*/}

                <Panel title="Books">{cards(visible)}</Panel>
            </ShelfBody>
        </>
    );
}

export default Shelf;
