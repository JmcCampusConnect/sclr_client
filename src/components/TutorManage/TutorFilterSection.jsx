import React, { useState, useEffect } from "react";
import SearchDropdown from "../../common/SearchDropDown";

function TutorFilterSection({ depts, filterForm, batchs }) {

    const [filterFormData, setFilterFormData] = useState({
        category: "All",
        department: "All",
        batch: "All"
    });

    console.log("Fikter", batchs)

    const batchOptions = ["All", ...batchs].map((v) => ({
        value: String(v),
        label: String(v),
    }));


    const categoryOptions = [
        { value: "All", label: "All" },
        { value: "Aided", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" }
    ];

    const handleSelectChange = (name, option) => {
        const updatedForm = {
            ...filterFormData,
            [name]: option ? String(option.value) : "",
        };
        setFilterFormData(updatedForm);
        filterForm(updatedForm);
    };

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Category"
                        name="category"
                        value={filterFormData.category}
                        options={categoryOptions}
                        onChange={handleSelectChange}
                    />
                </div>
                {/* Department ID */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Department ID"
                        name="department"
                        value={filterFormData.department}
                        options={depts}
                        onChange={handleSelectChange}
                    />
                </div>
                {/* Batch*/}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Batch"
                        name="batch"
                        value={filterFormData.batch}
                        options={batchOptions}
                        onChange={handleSelectChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default TutorFilterSection;