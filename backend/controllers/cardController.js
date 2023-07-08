const Card = require('../models/card');
const {
  ERR_MESSAGE_FORBIDDEN_ELEMENT_ID,
  CARD_RU,
  ERROR_NOT_FOUND,
  CODE_201,
  ERROR_VALIDATION,
  MESSAGE_CARD_DELETE,
  ERR_MESSAGE_DELETE_OTHER_CARD,
} = require('../utils/constants');
const NotFoundException = require('../exceptions/notFoundException');
const DataException = require('../exceptions/dataException');
const NotAccessException = require('../exceptions/notAccessException');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards.reverse()))
    .catch(next);
};
const createCard = (req, res, next) => {
  const card = req.body;
  card.owner = req.user._id;
  Card.create(card)
    .then((cardFromDb) => Card.findById(cardFromDb._id).populate('owner'))
    .then((newCard) => res.status(CODE_201).send(newCard))
    .catch((err) => {
      if (err.name === ERROR_VALIDATION) {
        next(new DataException(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  Card.findById(id)
    .orFail(new NotFoundException(ERR_MESSAGE_FORBIDDEN_ELEMENT_ID(CARD_RU, id)))
    .then((card) => {
      if (card.owner.toString() !== _id) {
        return Promise.reject(new NotAccessException(ERR_MESSAGE_DELETE_OTHER_CARD));
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: MESSAGE_CARD_DELETE }));
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: _id } }, { new: true })
    .orFail(new NotFoundException(ERROR_NOT_FOUND))
    .populate(['likes', 'owner'])
    .then((card) => res.send(card))
    .catch(next);
};

const removeLike = (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(new NotFoundException(ERROR_NOT_FOUND))
    .populate(['likes', 'owner'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCardById, addLike, removeLike,
};
