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

	// Define state hooks 
 	const [form, setForm] = useState({ name: "", message: "" });

	// Handler uses setForm from state above
	function handleInputChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleFormSubmit(e) {
		// prevent default reload pages for submit
		e.preventDefault();
		// FormData require by the post function
		const formData = new FormData();
		formData.append("name", form.name);
		formData.append("message", form.message);

		const res = await fetch("/api/quote", {
			method: "post",
			body: formData
			
		});
		// If your backend keeps returning a redirect, you may not get JSON here,
		// so just clear the form or optionally reload data from the backend.
		setForm({ name: "", message: "" });
		// re-fetch quotes
		fetch(`/api/quotes?max_age=${filter}`)
			.then(res => res.json())
			.then(setQuotes);
	}



	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/*  √√√  TODO: implement custom form submission logic to not refresh the page */}
			<form onSubmit={handleFormSubmit}>
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required value={form.name} onChange={handleInputChange}/>
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required value={form.message} onChange={handleInputChange}/>
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* √√√ TODO: Display the actual quotes from the database */}
			 <label htmlFor="quote-filter">View quotes from: </label>
			 {/* select menu */}
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
                {quotes.slice().reverse().map((q, i) => (
                    <QuoteItem {...q} key={i} />
                ))}
			
            </div>
        </div>
    );
}

export default App;