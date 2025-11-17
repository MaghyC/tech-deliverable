import React, { useState, useEffect } from "react";

import "./App.css";

function QuoteItem({ name, message, time }) {
    // Separate quote display component
    return (
        <div className="quote-item">
            <b>{name}</b>: "{message}" <span>({new Date(time).toLocaleString()})</span>
        </div>
    );
}


function App() {
	const [quotes, setQuotes] = useState([]);
    const [filter, setFilter] = useState("all");

    // Load quotes when filter changes
    useEffect(() => {
        fetch(`/api/quotes?max_age=${filter}`)
            .then(res => res.json())
            .then(setQuotes);
    }, [filter]);


	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			 <label htmlFor="quote-filter">View quotes from: </label>
            <select
                id="quote-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >	
                <option value="week">Last week</option>
                <option value="month">Last month</option>
                <option value="year">Last year</option>
                <option value="all">All</option>
            </select>
            <div className="messages">
                {quotes.map((q, i) => (
                    <QuoteItem {...q} key={i} />
                ))}
            </div>
        </div>
    );
}

export default App;