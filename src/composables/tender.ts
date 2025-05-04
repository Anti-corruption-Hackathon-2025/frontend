import { backendAPI } from "../backend";

export interface Person {
  name: string;
  pinfl: number;
}

export interface Organization {
  tin: number;
  name: string;
  creator: Person;
  address: string;
  cea: number;
  date: number;
}

export interface TenderItem {
  quantity: number;
  unit: string;
  categories: string[];
  price: number;
}

export interface Tender {
  lot_number: number;
  title: string;
  consumer: Organization;
  start_date: number;
  end_date: number;
  start_price: number;
  cea: number;
  items: TenderItem[];
}

export interface TenderPosition {
  organization: Organization;
  price: number;
}

export function useTender() {
  async function getTenders(): Promise<Tender[]> {
    const response = await backendAPI.get("/tenders");
    return response.data["data"]["tenders"] as Tender[];
  };

  async function getTender(tenderLotNumber: number): Promise<Tender> {
    const response = await backendAPI.get(`/tenders/${tenderLotNumber}`);
    return response.data["data"]["tender"] as Tender;
  };

  async function createPosition(tenderLotNumber: number, organization: Organization, amount: number): Promise<TenderPosition> {
    const params = {amount: amount, organization: JSON.stringify(organization)};
    const response = await backendAPI.post(`/tenders/${tenderLotNumber}/positions`, undefined, {params});
    return response.data["data"]["position"] as TenderPosition;
  };

  async function getTenderPositions(tenderLotNumber: number): Promise<TenderPosition[]> {
    const response = await backendAPI.get(`/tenders/${tenderLotNumber}/positions`);
    return response.data["data"]["positions"] as TenderPosition[];
  };

  return { getTenders, getTender, createPosition, getTenderPositions };
}
