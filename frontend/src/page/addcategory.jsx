import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Save, Minus } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../configure/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loadeSlic";
import _ from "lodash";
function AddCategory() {
  const dispatch = useDispatch();
  const [editcategory, setEditcategory] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [editcat_name,setEditcat_Name]=useState(null)
  const [fields, setFields] = useState([
    { name: "", placeholder: "", type: "", Options: [] },
  ]);

  const catref = useRef();
  const fieldRef = useRef([]);

  useEffect(() => {
    if (id) getcategory();
  }, [id]);

  const getcategory = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get(`/admin/category/${id}`);
      console.log("respone get category=", response);
      setCategoryName(response.data.category.category);
      setEditcat_Name(response.data.category.category)
      let corefields = response.data.category.specific_fields;
      setFields(
        corefields.map((val) => ({
          name: val.name,
          placeholder: val.placeholder,
          type: val.type,
          Options: val.Options || [],
        }))
      );
      const stripId = (ff) => ff.map(({ _id, ...rest }) => rest);

      setEditcategory(JSON.parse(JSON.stringify(stripId(corefields))));
    } catch (error) {
      console.log("error in getting category with id=", error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const addNewField = () => {
    setFields([
      ...fields,
      {
        name: "",
        placeholder: "",
        type: "",
      },
    ]);
  };
  const addDropdownOption = (index) => {
    const list = [...fields];
    list[index].Options.push("");
    console.log("otpion=", list);
    setFields(list);
  };

  const removeField = (ind) => {
    setFields(fields.filter((field, index) => index !== ind));
    console.log("fields=", fields);
  };

  const removeDropdownOption = (index, optindex) => {
    if (fields[index].Options.length === 1) return null;
    console.log("handle remove options");

    const updatefields = [...fields];
    updatefields[index].Options.splice(optindex, 1);
    console.log("after remove otion=", updatefields);
    setFields(updatefields);
    console.log("handle remove options");
  };

  const handleFieldChange = (index, e) => {
    // console.log("indie handle change",index)
    const list = [...fields];
    // console.log("list=",list)
    const { name, value } = e.target;
    list[index][name] = value;
    if (name === "type") {
      list[index].Options = value === "select" ? [""] : [];
    }

    setFields(list);
    //     console.log(e)
    //    console.log("name=",name,"value=",value)
  };

  console.log("field=", fields);

  const validation = () => {
    // console.log("ref=",fieldref)
    let val = true;
    if (!categoryName.trim()) {
      catref.current.focus();

      toast.error("category name is required");
      return (val = false);
    }

    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].name.trim()) {
        fieldRef.current[i]?.name?.focus();

        toast.error("field name is required");
        return (val = false);
      } else if (!fields[i].placeholder.trim()) {
        fieldRef.current[i]?.placeholder?.focus();

        toast.error("place hoder is required");
        return (val = false);
      } else if (!fields[i].type) {
        fieldRef.current[i]?.type?.focus();

        toast.error("field type  is required");
        return (val = false);
      } else if (fields[i].type === "select") {
        console.log("inside the condition of select");
        for (let j = 0; j < fields[i]?.Options?.length; j++) {
          console.log("inside");
          if (!fields[i].Options[j].trim()) {
            fieldRef.current[i]?.Options?.[j]?.focus();

            toast.error("all dropdown option required");
            return (val = false);
          }
        }
      }
    }
    // console.log("val=",val)
    return val;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let checkval = validation(); // This returns true/false
    console.log("check val=", checkval); // ✅ No ()
    const newfields=fields.map((val)=>({
      name:val.name.trim(),
      placeholder:val.placeholder.trim(),
      type:val.type.trim(),
      Options:val.Options

    }))
    console.log("new field=",newfields)

    if (checkval) {
      try {
        if (id) {
          // console.log("initial data=",JSON.stringify(editcategory))
          // console.log("current data",JSON.stringify(fields))
          console.log("edit",editcategory);
          console.log("fields=", fields);
          const check = JSON.stringify(editcategory) == JSON.stringify(fields);
           let check_cat_name=editcat_name == categoryName ? true :false
           console.log(editcat_name,"=",categoryName)

           console.log("validate=",check_cat_name)

          //  return null
          if (check && check_cat_name) {
           return toast.error("no changes were made");
            
          }
   
          dispatch(showLoading());
          const response = await axiosInstance.put(
            `admin/updatecategory/${id}`,
            { categoryName, newfields }
          );
          navigate("/Admin/category");
        } else {
           dispatch(showLoading());
          const response = await axiosInstance.post("/admin/addcategory", {
            categoryName,
            newfields,
          });
          console.log("response category=", response);
          navigate("/Admin/category");
        }
      } catch (error) {
        if (id) {
          console.log("error in updating category", error);
        } else {
          console.log("error in add category=", error);
        }
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const handleOptionChange = (index, optindex, e) => {
    const { value } = e.target;
    console.log("index=", index, "optindex=", optindex, "value=", value);
    let list = [...fields];
    list[index].Options[optindex] = value;
    console.log("list=", list);
    setFields(list);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
      <h1 className="text-xl font-medium text-gray-800 mb-6">
        Add New Category
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name*
          </label>
          <input
            ref={catref}
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Electronics, Clothing"
          />
        </div>

        {/* Fields Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700">
              Category Fields
            </h2>
            <button
              type="button"
              onClick={addNewField}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} />
              Add Field
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* Field Name */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name*
                  </label>
                  <input
                    ref={(el) => {
                      if (!fieldRef.current[index])
                        fieldRef.current[index] = {};
                      fieldRef.current[index].name = el;
                    }}
                    type="text"
                    name="name"
                    value={field.name}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. price, color"
                  />
                </div>

                {/* Placeholder */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder
                  </label>
                  <input
                    ref={(el) => {
                      if (!fieldRef.current[index])
                        fieldRef.current[index] = {};
                      fieldRef.current[index].placeholder = el;
                    }}
                    type="text"
                    name="placeholder"
                    value={field.placeholder}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Enter price"
                  />
                </div>

                {/* Type */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type
                  </label>
                  <select
                    ref={(el) => {
                      if (!fieldRef.current[index])
                        fieldRef.current[index] = {};
                      fieldRef.current[index].type = el;
                    }}
                    value={field.type}
                    name="type"
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">select</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>

                {/* Remove Button */}
                <div className="md:col-span-3 flex items-end">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="flex items-center justify-center gap-1 w-full px-3 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
                {/* {console.log("option=",field.options)
                    } */}
                {/* Dropdown Options (only shown when type is dropdown) */}
                {field.type === "select" && (
                  <div className="md:col-span-12 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Dropdown Options
                      </label>
                      <button
                        type="button"
                        onClick={() => addDropdownOption(index)}
                        className="flex items-center gap-1 px-2 py-3 text-xs bg-green-100 text-green-600 rounded hover:bg-green-100"
                      >
                        <Plus size={14} />
                        Add Option
                      </button>
                    </div>

                    {field.Options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-2 h-10  w-2/3"
                      >
                        <input
                          type="text"
                          ref={(el) => {
                            if (!fieldRef.current[index])
                              fieldRef.current[index] = {};
                            if (!fieldRef.current[index].Options)
                              fieldRef.current[index].Options = [];
                            fieldRef.current[index].Options[optionIndex] = el;
                          }}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, optionIndex, e)
                          }
                          className=" px-3  w-full h-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeDropdownOption(index, optionIndex)
                          }
                          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center border-t pt-6 gap-4">
          <button
            type="button"
            onClick={() => navigate("/Admin/category")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>

          {id ? (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
