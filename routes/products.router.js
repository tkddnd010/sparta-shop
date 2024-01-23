import express from 'express';
import products from '../schemas/products.schema.js';

const router = express.Router();

// 상품 등록 API
router.post('/products', async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다' });
    }

    const { title, content, author, password } = req.body;

    const product = new products({
      title,
      content,
      author,
      password,
    });
    await product.save();

    return res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
  } catch {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  try {
    const product = await products
      .find()
      .select('title author status createdAt')
      .sort('-createdAt')
      .exec();

    return res.status(200).json({ data: product });
  } catch {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const currentProduct = await products.findById(productId).exec();
    if (!currentProduct) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    const product = await products
      .findOne({ _id: productId })
      .select('title content author status createdAt');

    return res.status(200).json({ data: product });
  } catch {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 정보 수정 API
router.patch('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, content, password, status } = req.body;

    if (!req.params || !req.body) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const currentProduct = await products.findById(productId).exec();

    if (!currentProduct) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (currentProduct.password !== password) {
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    await products.updateOne(
      { _id: productId },
      { $set: { title, content, status, password } }
    );

    return res.status(200).json({ message: '상품 정보를 수정하였습니다.' });
  } catch {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 삭제 API
router.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { password } = req.body;

    if (!password || !productId) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const currentProduct = await products.findById(productId).exec();

    if (!currentProduct) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (currentProduct.password !== password) {
      return res
        .status(401)
        .json({ message: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }

    await products.deleteOne({ _id: currentProduct });

    return res.status(200).json({ message: '상품을 삭제하였습니다.' });
  } catch {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

export default router;
