import React, {useState, useEffect} from "react";
import SearchDropdown from "../../common/SearchDropDown";

function TutorFilterSection({depts, filterForm}) {

    const [filterFormData, setFilterFormData] = useState({
        category: "All",
        department: "",
        batch: "All"
    });

    const batchOptions = ["All", "2020", "2021", "2022", "2023", "2024","2025"].map((v) => ({
        value: v, label: v,
    }));

    const categoryOptions = ["All", "AIDED", "SFM", "SFW"].map((v) => ({
        value: v, label: v,
    }));

    const handleSelectChange = (name, option) => {
        const updatedForm = {
            ...filterFormData,
            [name]: option ? option.value : "",
        };
        setFilterFormData(updatedForm);
        filterForm(updatedForm); // Call with latest value
    };

    // console.log(filterFormData)




    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    return (
        <div className="w-full space-y-6">
            {/* === DROPDOWN SECTION === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Category */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Category"
                        name="category"
                        value={filterFormData.category}
                        options={categoryOptions}
                        onChange={handleSelectChange}
                    // required
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
                    // required
                    />

                </div>

            </div>
        </div>
    )
}

export default TutorFilterSection;