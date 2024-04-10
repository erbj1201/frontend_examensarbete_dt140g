import Footer from "../components/Footer";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";

const DetailsPage: React.FC = () => {
//Definera vilken typ av data som animals innehåller
    interface Animal {
        id: number;
        animalId: string;
        breed: string;
        name: string;
        imagepath: string;
        herd_id: number;
    }
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        const getAnimals = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/animals")

                if (response.ok) {
                    const jsonData = await response.json();
                    setAnimals(jsonData);
                } else {
                    throw new Error('Något gick fel');
                }
            } catch (error) {
                console.error('Fel vid hämtning');
            }
        };
        getAnimals();

    }, []);

    return (
        <div>
            <Header />
            <main className="container mx-auto">
                <h1>Detaljer</h1>
                {animals && animals.map((animal) => (
                    <div key={animal.id}>
                        <p>{animal.animalId}</p><p>{animal.name}</p><p>{animal.breed}</p><p>{animal.herd_id}</p>
                    </div>
                ))}
            </main>
            <Footer />
        </div>
    );
}
export default DetailsPage;