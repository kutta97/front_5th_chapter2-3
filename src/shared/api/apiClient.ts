import { API_BASE_URL } from "../config/constants" // 나중에 생성할 상수 파일

export interface RequestOptions {
  method?: RequestInit["method"]
  body?: unknown
  queryParams?: Record<string, string | number | boolean>
}

const ApiClient = (() => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const buildUrl = (path: string, queryParams?: RequestOptions["queryParams"]): string => {
    const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    return url.toString()
  }

  const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const { method = "GET", queryParams, body } = options
    const url = buildUrl(path, queryParams)

    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`[${response.status}]: ${response.statusText}`)
    }

    const data = response.json()

    return data as T
  }

  const get = <RESPONSE>(path: string, queryParams?: RequestOptions["queryParams"]): Promise<RESPONSE> => {
    return request<RESPONSE>(path, { method: "GET", queryParams })
  }

  const post = <RESPONSE, REQUEST>(path: string, body: REQUEST): Promise<RESPONSE> => {
    return request<RESPONSE>(path, { method: "POST", body })
  }

  const put = <RESPONSE, REQUEST>(path: string, body: REQUEST): Promise<RESPONSE> => {
    return request<RESPONSE>(path, { method: "PUT", body })
  }

  const patch = <RESPONSE, REQUEST>(path: string, body: REQUEST): Promise<RESPONSE> => {
    return request<RESPONSE>(path, { method: "PATCH", body })
  }

  const del = <RESPONSE>(path: string): Promise<RESPONSE> => {
    return request<RESPONSE>(path, { method: "DELETE" })
  }

  return {
    get,
    post,
    put,
    patch,
    del,
  }
})()

export default ApiClient
