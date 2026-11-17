
export default function({ page, pageCount, onChange }) {
    return (
        <div className="pager">
            <button 
                className="pager-step"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
            >&larr; Prev</button>
            <span className="pager-where">page {page} of {pageCount}</span>
            <button 
                className="pager-step"
                disabled={page >= pageCount}
                onClick={() => onChange(page + 1)}
            >&rarr; Next</button>
        </div>
    )
}