import React, { useEffect, useState } from 'react';
import api from '../api-config-folder';
import './NurseDetail.css';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const NurseDetail = () => {
    const [nurses, setNurses] = useState([]);
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', licenseNumber: '', dob: '', age: '' });
    const [editNurse, setEditNurse] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');

    //fetch all nurse list
    const fetchNurses = async () => {
        try {
            const response = await api.get('/nurse/get-all-nurse');
            if (response.data.success) {
                setNurses(response.data.nurses);
                setData(response.data.nurses.map(({ _id, __v, dob, ...rest }) => ({
                    ...rest,
                    dob: new Date(dob).toISOString().split('T')[0],
                })));
            }
        } catch (error) {
            console.error('Error fetching nurses:', error);
        }
    };

    //setting the input value
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDOBChange = (e) => {
        const dob = e.target.value;
        const age = calculateAge(dob);
        setFormData({ ...formData, dob, age });
    };

    //open modal to add new nurse
    const handleAddButtonClick = () => {
        setShowModal(true);
        setEditNurse(null);
        setFormData({ name: '', licenseNumber: '', dob: '', age: '' });
    };

    //open modal to edit the nurse
    const handleEdit = (id) => {
        const nurse = nurses.find(nurse => nurse._id === id);
        if (nurse) {
            setShowModal(true);
            setEditNurse(nurse._id);
            const dobDate = nurse.dob.split('T')[0];
            setFormData({
                name: nurse.name,
                licenseNumber: nurse.licenseNumber,
                dob: dobDate,
                age: nurse.age
            });
        }
    };

    //delete the nurse data
    const handleDelete = async (id) => {
        try {
            let response = await api.delete(`/nurse/delete-nurse/${id}`);
            if (response.data.success) {
                toast.success(response.data.message)
                fetchNurses();
            }
        } catch (error) {
            console.log(error);
        }
    };

    //close the modal
    const handleModalClose = () => {
        setShowModal(false);
        setEditNurse(null);
        setFormData({ name: '', licenseNumber: '', dob: '', age: '' });
    };


    // Add or Edit Nurse based on editNurse state
    const formSubmit = async (event) => {
        event.preventDefault();
        if (formData.name && formData.licenseNumber && formData.dob && formData.age) {
            try {
                let response;
                if (editNurse) {
                    response = await api.put(`/nurse/edit-nurse/${editNurse}`, formData);
                } else {
                    response = await api.post("/nurse/add-nurse", formData);
                }
                if (response.data.success) {
                    setShowModal(false);
                    toast.success(response.data.message);
                    fetchNurses();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.response.data.message);
                // toast.error("An error occurred while saving the nurse.");
            }
        } else {
            toast.error("All fields are mandatory");
        }
    };

    //download excel
    const downloadExcel = () => {
        console.log(data, "101");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'nurseList.xlsx');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredNurses = nurses.filter(nurse =>
        nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (nurse.licenseNumber && nurse.licenseNumber.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (nurse.age && nurse.age.toString().includes(searchQuery)) ||
        (nurse.dob && new Date(nurse.dob).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).includes(searchQuery))
    );

    //handle click on th for sorting
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    //creating new array after sort
    const sortedAndFilteredNurses = filteredNurses.slice().sort((a, b) => {
        const aValue = sortBy ? a[sortBy] : '';
        const bValue = sortBy ? b[sortBy] : '';
        if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });


    const renderArrow = (column) => {
        if (sortBy === column) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return null;
    };

    useEffect(() => {
        fetchNurses();
    }, []);

    return (
        <div>
            <h1 className='textCenter'>Nurse Management System</h1>
            <div className='table-shadow'>
                <div className='filter-div'>

                    <input type="search" className='margin-right-css search-input' placeholder="Search by name or license..." value={searchQuery} onChange={handleSearchChange} />
                    <button type='button' className='add-button-css margin-right-css' onClick={() => handleAddButtonClick()}>Add Nurse</button>
                    <button className='margin-right-css download-button-css' onClick={downloadExcel}>Download Excel</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>
                                Name {renderArrow('name')}
                            </th>
                            <th onClick={() => handleSort('licenseNumber')}>
                                License Number {renderArrow('licenseNumber')}
                            </th>
                            <th onClick={() => handleSort('dob')}>
                                Date of Birth {renderArrow('dob')}
                            </th>
                            <th onClick={() => handleSort('age')}>
                                Age {renderArrow('age')}
                            </th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredNurses.map(nurse => (
                            <tr key={nurse.licenseNumber}>
                                <td>{nurse.name}</td>
                                <td>{nurse.licenseNumber}</td>
                                <td>{new Date(nurse?.dob).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}</td>
                                <td>{nurse.age}</td>
                                <td>
                                    <button className='margin-right-css edit-button-css' onClick={() => handleEdit(nurse._id)}>Edit</button>
                                </td>
                                <td>
                                    <button className='margin-right-css delete-button-css' onClick={() => handleDelete(nurse._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleModalClose}>&times;</span>
                        <h2>{editNurse ? 'Edit Nurse' : 'Add New Nurse'}</h2>
                        <form onSubmit={formSubmit}>
                            <label >Name : </label><br />
                            <input type="text" name='name' onChange={handleChange} value={formData.name} /><br />
                            <label >License Number : </label><br />
                            <input type="text" name='licenseNumber' onChange={handleChange} value={formData.licenseNumber} /><br />
                            <label >DOB : </label><br />
                            <input type="date" name='dob' onChange={handleDOBChange} value={formData.dob} /><br />
                            <label >Age : </label><br />
                            <input type="number" name='age' onChange={handleChange} value={formData.age} /><br />
                            <input type="submit" className='submit-button' value={editNurse ? "Update Nurse" : "Add Nurse"} />
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NurseDetail;