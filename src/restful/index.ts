import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

interface FailureResponse {
  code: number
  message: string
}

interface SuccessResponse<T> {
  code: 0
  message: string
  data: T
}

type Response<T> = FailureResponse | SuccessResponse<T>

export function isSuccess<T>(resp: Response<T>): resp is SuccessResponse<T> {
  return resp.code === 0
}

export class RestfulClient {
  private client: AxiosInstance

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
  }

  async request<T>(config: AxiosRequestConfig): Promise<Response<T>> {
    try {
      const resp = await this.client.request<Response<T>>(config)
      return resp.data
    }
    catch (e) {
      // error is not AxiosError
      if (!(e instanceof AxiosError)) {
        console.error('Error is not AxiosError')
        return {
          code: -1,
          message: '',
        }
      }

      // status exists
      const err = e as AxiosError<Response<T>>
      if (err.response?.status)
        return err.response.data

      // status not exists
      return {
        code: -1,
        message: '',
      }
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<Response<T>> {
    return await this.request<T>({
      method: 'GET',
      url,
      ...config,
    })
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
    return await this.request<T>({
      method: 'POST',
      data,
      url,
      ...config,
    })
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
    return await this.request<T>({
      method: 'PATCH',
      data,
      url,
      ...config,
    })
  }

  async delete<T>(url: string, config?: any): Promise<Response<T>> {
    return await this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    })
  }
}
