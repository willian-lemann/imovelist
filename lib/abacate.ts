const ABACATEPAY_API_URL = "https://api.abacatepay.com/v1";

function getHeaders() {
  return {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Bearer ${process.env.ABACATEPAY_API_KEY!}`,
  };
}

export interface AbacatePayProduct {
  externalId: string;
  name: string;
  description?: string;
  quantity: number;
  /** Preço unitário em centavos (mínimo 100) */
  price: number;
}

export interface AbacatePayBillingRequest {
  frequency: "ONE_TIME" | "MULTIPLE_PAYMENTS";
  methods: ("PIX" | "CARD")[];
  products: AbacatePayProduct[];
  returnUrl: string;
  completionUrl: string;
  customerId?: string;
  customer?: {
    name: string;
    cellphone: string;
    email: string;
    taxId: string;
  };
}

export interface AbacatePayBilling {
  id: string;
  url: string;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  devMode: boolean;
  methods: string[];
  products: { id: string; externalId: string; quantity: number }[];
  frequency: string;
  nextBilling: string | null;
  customer: {
    id: string;
    metadata: {
      name: string;
      cellphone: string;
      email: string;
      taxId: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface AbacatePayCustomer {
  id: string;
  metadata: {
    name: string;
    cellphone: string;
    email: string;
    taxId: string;
  };
}

export const abacatePayClient = {
  async createCustomer(data: {
    name: string;
    cellphone: string;
    email: string;
    taxId: string;
  }): Promise<AbacatePayCustomer> {
    const res = await fetch(`${ABACATEPAY_API_URL}/customer/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    return json.data;
  },

  async listCustomers(): Promise<AbacatePayCustomer[]> {
    const res = await fetch(`${ABACATEPAY_API_URL}/customer/list`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    return json.data;
  },

  async createBilling(
    data: AbacatePayBillingRequest,
  ): Promise<AbacatePayBilling> {
    const res = await fetch(`${ABACATEPAY_API_URL}/billing/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    return json.data;
  },

  async getBilling(id: string): Promise<AbacatePayBilling> {
    const res = await fetch(
      `${ABACATEPAY_API_URL}/billing/get?id=${encodeURIComponent(id)}`,
      { headers: getHeaders() },
    );
    const json = await res.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    return json.data;
  },

  async listBillings(): Promise<AbacatePayBilling[]> {
    const res = await fetch(`${ABACATEPAY_API_URL}/billing/list`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    return json.data;
  },
};
