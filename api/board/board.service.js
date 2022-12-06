const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find({}).toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ _id: ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

// async function update(board) {
//     try {
//         const boardToSave = {
//             title: board.title,
//             isStarred: false,
//             style: board.style,
//             groups: board.groups,
//             activities: board.activities,
//             memberIdx: board.memberIds,
//             labels: board.labels
//         }
//         const collection = await dbService.getCollection('board')
//         await collection.updateOne({ _id: ObjectId(board._id) }, { $set: boardToSave })
//         return board
//     } catch (err) {
//         logger.error(`cannot update board ${boardId}`, err)
//         throw err
//     }
// }

async function update(board) {
    try {
      var id = ObjectId(board._id)
      delete board._id
      const collection = await dbService.getCollection('board')
      await collection.updateOne({ _id: id }, { $set: { ...board } })
      board._id = id
      return board
    } catch (err) {
      logger.error(`cannot update board ${board._id}`, err)
      throw err
    }
  }

function _getLabels() {
    return [
        {
            id: 'l101',
            title: '',
            color: '#7bc86c'
        },
        {
            id: 'l102',
            title: '',
            color: '#f5dd29'
        },
        {
            id: 'l103',
            title: '',
            color: '#ffaf3f'
        },
        {
            id: 'l104',
            title: '',
            color: '#ef7564'
        },
        {
            id: 'l105',
            title: '',
            color: '#cd8de5'
        },
        {
            id: 'l106',
            title: '',
            color: '#5ba4cf'
        },

    ]
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
