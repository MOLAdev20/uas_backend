import express from 'express'
import MStudent from '../models/MStudent.js';
import upload from '../library/uploadAvatar.js';
import { Op } from 'sequelize';
import fs, { stat } from 'fs'


const app = express()

app.get("/", async (req, res) => {

    const data = await MStudent.findAll({
        order: [["id", "DESC"]]
    })
    return res.status(200).json({
        status: "success",
        data
    })

})

app.get("/search", async (req, res) => {

    const data = await MStudent.findAll({
        where: {
            [Op.or] : [
                { nisn: { [Op.like]: `%${req.query.q}%` } },
                { name: { [Op.like]: `%${req.query.q}%` } },
                { gender: { [Op.like]: `%${req.query.q}%` } },
                { birth_place: { [Op.like]: `%${req.query.q}%` } },
            ]
        },
        order: [["id", "DESC"]]
    })

    if(data.length === 0) {
        return res.status(404).json({
            status: "failed",
            message: "Data not found"
        })
    }

    return res.status(200).json({
        status: "success",
        data
    })
})

app.post("/insert", (req, res) => {

    if(req.body.nisn.length > 10){
        return res.status(400).json({
            status: "nisn-max-reached",
            message: "NISN must be 10 digits"
        })
    }

    MStudent.create({
        nisn: req.body.nisn,
        name: req.body.studentName,
        avatar: "none",
        gender: req.body.gender,
        religion: req.body.religion,
        birth_place: req.body.birth_place,
        birth_date: req.body.birth_date,
        address: req.body.address
    })
    .then(data => {
        return res.status(200).json({
            status: "success",
            message: "Data successfully inserted",
            data
        })
    })
    .catch(({errors}) => { 

        if(errors[0].type == "unique violation"){
            // conflict
            return res.status(409).json({
                status: "nisn-conflict",
                message: "NISN already exists"  
            })
        }
        return res.status(400).json({
            status: "failed",
            message: errors[0].message
        })
    })

});

app.get("/detail/:studentId", async (req, res) => {

    const data = await MStudent.findByPk(req.params.studentId)

    if( !data ){
        return res.status(404).json({
            status: "failed",
            message: "Data not found"
        })
    }

    return res.status(200).json({
        status: "success",
        data
    })


})

app.post('/upload-avatar/:studentId', async (req, res, next) => {

    await MStudent.findByPk(req.params.studentId)
    .then(data => {
        if( !data ){
            return res.status(404).json({
                status: "not-found",
                message: "Data not found"
            })
        }

        if(data.avatar != "none" && fs.existsSync(`./public/upload/${data.avatar}`)){
            fs.unlinkSync(`./public/upload/${data.avatar}`);
        }
    })
    
    next();

}, upload.single('avatar'), async (req, res) => {
    try {

        await MStudent.update({ avatar: req.file.filename }, { where: { id: req.params.studentId } });

        res.status(200).json({
            status: 'success',
            message: 'Foto berhasil diupload!',
            file: req.file.filename
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed-upload',
            message: 'Upload gagal!', error: err.message
        });
    }
});

app.post("/edit/:studentId", async (req, res) => {
    try {
        const { nisn, studentName, gender, religion, birth_place, birth_date, address } = req.body;

        if (nisn.length > 10) {
            return res.status(400).json({ status: "nisn-max-reached", message: "NISN must be 10 digits" });
        }

        const student = await MStudent.findByPk(req.params.studentId);
        if (!student) {
            return res.status(404).json({ status: "failed", message: "Data not found" });
        }

        if (nisn !== student.nisn) {
            const existingNisn = await MStudent.findOne({ where: { nisn } });
            if (existingNisn) {
                return res.status(409).json({ status: "nisn-conflict", message: "NISN already exists" });
            }
        }

        const update = { 
            name: studentName, 
            gender, 
            religion, 
            birth_place, 
            birth_date, 
            address, 
            nisn, 
            updated_at: new Date() 
        };

        await MStudent.update(update, { where: { id: req.params.studentId } });

        res.status(200).json({ status: "success", message: "Data successfully updated", update });
    } catch (error) {
        res.status(400).json({ status: "failed", message: error.message || "Something went wrong" });
    }
});

app.delete("/delete/:studentId", async (req, res) => {

    const student = await MStudent.findByPk(req.params.studentId);
    if( !student ){
        return res.status(404).json({
            status: "not-found",
            message: "Data not found"
        })
    }

    if(student.avatar != "none" && fs.existsSync(`./public/upload/${student.avatar}`)){
        fs.unlinkSync(`./public/upload/${student.avatar}`);
    }

    await MStudent.destroy({ where: { id: req.params.studentId } });

    res.status(200).json({
        status: "success",
        message: "Data successfully deleted"
    })
})

  

export default app