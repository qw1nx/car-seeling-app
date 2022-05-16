module.exports = {
    async get(req, res){
        const id = req.params.id;

        try{
            const [car, accessories] = await Promise.all([
                req.storage.getById(id),
                req.accessory.getAll()
            ]);

            if (car.owner != req.session.user.id) {
                console.log('User is not owner!');
                return res.redirect('/login');
            }

            const existingIds = car.accessories.map(a => a.id.toString());
            const availableAccessories = accessories.filter(a =>  existingIds.includes(a.id.toString()) == false);
            res.render('attach', {title: 'Attach Accessory', car, accessories: availableAccessories});
        } catch (err){
            console.log('No car')
            console.log(err.message)
            res.redirect('404')
        }


    },
    async post(req, res){
        console.log(req.params.id, req.body);
        const carId = req.params.id;
        const accessoryId = req.body.accessory;
        try {

            if(await req.storage.attachAccessory(carId, accessoryId, req.session.user.id)){
                res.redirect('/login');
            } else {
                res.redirect('/')
            }
        } catch (e) {
            console.log('Error creating accessory');
            console.log(e.message);
            res.redirect('/attach/' + carId)
        }

    }
}