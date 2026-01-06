import React from "react";
import { Card } from "./UI";

const DocumentsSection = ({ student, apiUrl }) => {

    const jamathPath = student?.jamathLetter?.replace(/\\/g, "/");

    return (
        <Card title="Uploaded Documents">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className="font-semibold mb-2">
                        Jamath / Declaration Letter :
                    </p>

                    {jamathPath ? (
                        <img
                            src={`${apiUrl}/${jamathPath}`}
                            alt="Jamath Letter"
                            className="rounded-lg shadow-md border border-gray-200 max-h-72 object-contain"
                        />
                    ) : (
                        <p className="text-gray-500 italic">
                            Jamath letter not uploaded
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default DocumentsSection;
