import React from "react";
import { Card } from "./UI";

const DocumentsSection = ({ student, apiUrl }) => (

    <Card title="Uploaded Documents">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <p className="font-semibold mb-2">Jamath / Declaration Letter : </p>
                <img
                    src={`${apiUrl}/${student.jamathLetter}`}
                    alt="Jamath Letter"
                    className="rounded-lg shadow-md border border-gray-200 max-h-72 object-contain"
                />
            </div>
        </div>
    </Card>
)

export default DocumentsSection;
