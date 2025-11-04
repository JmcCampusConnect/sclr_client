import React from "react";
import Select from "react-select";

export default function SearchDropdown({ label, name, value, options = [], onChange, required = false }) {

    const selected = options.find((opt) => opt.value === value) || null;

    return (
        <div>
            {label && (
                <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                    {label} : {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select
                value={selected}
                onChange={(option) => onChange(name, option)}
                options={options}
                isSearchable
                placeholder=""
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                        borderColor: "#d1d5db",
                        borderRadius: "8px",
                        padding: "2px",
                    }),
                    singleValue: (base) => ({ ...base, color: "#111827" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
            />
        </div>
    )
}