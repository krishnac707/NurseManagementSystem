import nurseModal from "../modal/nurse.modal.js";
import validator from "validator";

export const addNurse = async(req,res) => {
    try{
        const { name, licenseNumber, dob, age } = req.body;
        if (!name || !licenseNumber || !dob || !age) return res.status(400).json({ success: false, message: "All fields are mandatory" })

        if (!validator.isLength(name, { min: 3 })) {
            return res.status(400).json({ success: false, message: "Name must be at least 3 characters" })
        }

        if (!validator.isNumeric(licenseNumber) || !validator.isLength(licenseNumber, { min: 6 })) {
            return res.status(400).json({ success: false, message: "License number must be a number and at least 6 digits long" });
        }

        const checkLicenseNumber = await nurseModal.find({ licenseNumber: licenseNumber })
        if (checkLicenseNumber.length) {
            return res.status(409).json({ success: false, message: "License number already exist" });
        }

        const nurse = new nurseModal({ name, licenseNumber, dob, age });
        await nurse.save();
        return res.status(201).json({ success: true, message: "Nurse added successfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    } 
}

export const getAllNurses = async(req,res)=>{
    try{
        const nurses=await nurseModal.find()
        if (nurses.length) {
            return res.status(200).json({ success:true, nurses: nurses })
        }
        return res.status(404).json({ success:false, message: "No record found" })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    } 

}

export const updateNurse = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id,"39");
        console.log(req.body,"40");
        const { name, licenseNumber, dob, age } = req.body;
        if (!name || !licenseNumber || !dob || !age) {
            return res.status(400).json({ success: false, message: "All fields are mandatory" });
        }

        const updatedNurse = await nurseModal.findOneAndUpdate(
            { _id: id },
            { name, licenseNumber, dob, age },
            { new: true }
        );

        if (!updatedNurse) {
            return res.status(404).json({ success: false, message: "Nurse not found" });
        }
        return res.status(200).json({ success: true, message: "Nurse updated successfully", data: updatedNurse });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteNurse = async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedNurse = await nurseModal.findByIdAndDelete(id);
        if (!deletedNurse) {
            return res.status(404).json({ success: false, message: "Nurse not found" });
        }
        return res.status(200).json({ success: true, message: "Nurse deleted successfully"});
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
