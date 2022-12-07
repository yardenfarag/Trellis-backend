const boardService = require('./board.service.js')
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')
const utilService = require('../../services/util.service')
const asyncLocalStorage = require('../../services/als.service')


async function getBoards(req, res) {
  try {
    logger.debug('Getting Boards')
    const boards = await boardService.query()
    res.json(boards)
  } catch (err) {
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

async function getBoardById(req, res) {
  try {
    const boardId = req.params.id
    const board = await boardService.getById(boardId)
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

async function addBoard(req, res) {
  const { loggedinUser } = req

  try {
    const board = req.body
    board.createdBy = loggedinUser
    const addedBoard = await boardService.add(board)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}


async function updateBoard(req, res) {
  const store = asyncLocalStorage.getStore()
  const { loggedinUser } = store
  try {
    const { board, activityTxt, task } = req.body
    let activity = null
    if (activityTxt) {
      const miniTask = task ? { id: task.id || null, title: task.title } : null
      activity = {
        id: utilService.makeId(),
        txt: activityTxt,
        createdAt: Date.now(),
        byMember: loggedinUser,
        task: miniTask,
      }
    }
    if (activity) board.activities.unshift(activity)
    const updatedBoard = await boardService.update(board)
    socketService.broadcast({type: 'change-board', data: updatedBoard, userId:loggedinUser._id})
    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })

  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id
    const removedId = await boardService.remove(boardId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}


module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
}
