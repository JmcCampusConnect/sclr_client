import React from "react";
import Select from "react-select";

function SearchDropdown({ label, name, value, options = [], onChange, required = false, error, isMulti = false, }) {

    const selected = isMulti
        ? options.filter((opt) => value.includes(opt.value))
        : options.find((opt) => opt.value === value) || null;

    return (
        <div className="space-y-1">
            {label && (
                <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                    {label} : {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select
                inputId={name}
                name={name}
                value={selected}
                isMulti={isMulti}
                onChange={(option) => {
                    if (isMulti) { onChange(name, option ? option.map((opt) => opt) : []) }
                    else { onChange(name, option) }
                }}
                options={options}
                isSearchable
                placeholder=""
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: "transparent",
                        borderColor: error ? "#ef4444" : "#d1d5db",
                        boxShadow: state.isFocused
                            ? error
                                ? "0 0 0 1px #ef4444"
                                : "0 0 0 1px #3b82f6"
                            : "none",
                        borderRadius: "8px",
                        padding: "2px",
                        "&:hover": {
                            borderColor: error ? "#ef4444" : "#3b82f6",
                        },
                    }),
                    singleValue: (base) => ({ ...base, color: "#111827" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
            />
            {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
        </div>
    )
}

export default SearchDropdown