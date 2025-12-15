import { api } from "@/api/client";

export async function getProducts() {
  const response = await api.get("/api/products");
  return response.data;
}

export async function addProduct(productData) {
  const response = await api.post("/api/products", productData);
  return response.data;
}

export async function purchaseProduct(id, quantity) {
  const response = await api.post(`/api/products/${id}/purchase`, { quantity });
  return response.data;
}

export async function restockProduct(id, quantity) {
  const response = await api.post(`/api/products/${id}/restock`, { quantity });
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
}
