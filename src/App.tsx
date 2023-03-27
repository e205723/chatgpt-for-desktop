import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Database from "tauri-plugin-sql-api";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const db: Promise<Database> = setupDatabase();

    async function setupDatabase() {
        const database = await Database.load("sqlite:sqlite.db");
        await database.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
        return database;
    }

    async function greetSavedName() {
        // Query the saved name
        const rows: Array<{name: string}> = await (await db).select("SELECT name FROM users ORDER BY id DESC LIMIT 1");
        if (!rows || rows.length === 0) {
            console.error("No rows found in the database.");
            return;
        }
        const savedName = rows[0].name;
        setGreetMsg(`Hello, ${savedName}!`);
    }

    async function saveName() {
        // Save the name
        (await db).execute("INSERT INTO users (name) VALUES (?)", [name]);

        // Update the greet message
        setGreetMsg(`Hello, ${name}!`);
    }

    return (
        <div className="container">
            <h1>Welcome to Tauri!</h1>

            <div className="row">
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo vite" alt="Vite logo" />
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>

            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <div className="row">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        saveName();
                    }}
                >
                    <input
                        id="name-input"
                        onChange={(e) => setName(e.currentTarget.value)}
                        placeholder="Enter a name..."
                    />
                    <button type="submit">Save Name</button>
                </form>
                <button onClick={() => greetSavedName()}>Greet Saved Name</button>
            </div>
            <p>{greetMsg}</p>
        </div>
    );
}

export default App;