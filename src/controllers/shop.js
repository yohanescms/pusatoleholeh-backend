import Shop from '../models/shop.js';

export const createShop = async (req, res) => {
  const { name, description, location } = req.body;
  try {
    const shop = await Shop.create({
      name,
      description,
      location,
      ownerId: req.user.id
    });

    res.status(201).json({ message: 'Sukses membuat toko', shop });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateShop = async (req,  res) => {
  const { name, description, location } = req.body;
};
