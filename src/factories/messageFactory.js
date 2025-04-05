/**
 * Factory Method Pattern cho việc tạo các loại tin nhắn khác nhau (Frontend)
 */

// Abstract Creator
class MessageFactory {
  createMessage(sender, receiver, content, timestamp = new Date(), metadata = {}) {
    const message = this._createMessageObject(sender, receiver, content, timestamp, metadata)
    return message
  }

  // Method to be implemented by subclasses
  _createMessageObject() {
    throw new Error('Method _createMessageObject must be implemented by subclasses')
  }
}

// Concrete Creators
class TextMessageFactory extends MessageFactory {
  _createMessageObject(sender, receiver, content, timestamp = new Date(), metadata = {}) {
    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Tạm thời tạo ID
      sender,
      receiver,
      content,
      type: 'text',
      timestamp,
      status: 'sending', // Trạng thái tin nhắn: sending, sent, delivered, read, failed
      metadata
    }
  }
}

class ImageMessageFactory extends MessageFactory {
  _createMessageObject(sender, receiver, imageUrl, timestamp = new Date(), metadata = {}) {
    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Tạm thời tạo ID
      sender,
      receiver,
      content: imageUrl,
      type: 'image',
      timestamp,
      status: 'sending',
      metadata: {
        ...metadata,
        width: metadata.width || 'auto',
        height: metadata.height || 'auto',
        alt: metadata.alt || 'Hình ảnh'
      }
    }
  }
}

class FileMessageFactory extends MessageFactory {
  _createMessageObject(sender, receiver, fileUrl, timestamp = new Date(), metadata = {}) {
    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Tạm thời tạo ID
      sender,
      receiver,
      content: fileUrl,
      type: 'file',
      timestamp,
      status: 'sending',
      metadata: {
        ...metadata,
        fileName: metadata.fileName || 'Tệp tin',
        fileSize: metadata.fileSize || 0,
        fileType: metadata.fileType || 'application/octet-stream'
      }
    }
  }
}

class SystemMessageFactory extends MessageFactory {
  _createMessageObject(sender, receiver, content, timestamp = new Date(), metadata = {}) {
    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Tạm thời tạo ID
      sender,
      receiver,
      content,
      type: 'system',
      timestamp,
      status: 'delivered', // Tin nhắn hệ thống luôn được coi là đã gửi thành công
      metadata
    }
  }
}

// Factory Provider
class MessageFactoryProvider {
  static getFactory(messageType) {
    switch (messageType) {
    case 'text':
      return new TextMessageFactory()
    case 'image':
      return new ImageMessageFactory()
    case 'file':
      return new FileMessageFactory()
    case 'system':
      return new SystemMessageFactory()
    default:
      return new TextMessageFactory() // Mặc định là tin nhắn văn bản
    }
  }
}

export {
  MessageFactoryProvider,
  TextMessageFactory,
  ImageMessageFactory,
  FileMessageFactory,
  SystemMessageFactory
}