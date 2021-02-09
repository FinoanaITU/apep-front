import axios from 'axios'

class UploadFilesService {
  upload (file, onUploadProgress) {
    var formData = new FormData()
    formData.append('DSN', file)
    return axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/apep/json/',
        // url: 'http://sdabou.pythonanywhere.com/apep/json/',
        data: formData,
        headers: {
          'Content-Type': 'application/form-data',
        },
        onUploadProgress,
      })
      }
    }

export default new UploadFilesService()
