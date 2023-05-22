import Toast from "react-native-root-toast";
import { IAddressComponents, IPhuongXa, IQuanHuyen } from "../../define";
import { fetchPhuongXa } from "../services/api";
import { fetchQuanHuyen } from "../services/api";
import { checkIsNotNull } from "./checkNull";

export const getIDAddress = async (data: { admin_level_3: string, admin_level_4: string, street: string, housenumber: string, latitude: number, longitude: number }) => {
    let objRes: IResultAddComponent = {};
    const config = require('../config/config.json');
    const URL = config.BASE_URL;

    if (checkIsNotNull(data.street)) {
        objRes.street = data.street;
    }

    if (checkIsNotNull(data.housenumber)) {
        objRes.housenumber = data.housenumber;
    }

    await fetchQuanHuyen(URL)
        .then((res: any) => {
            if (res) {
                const resQuanHuyen = res.data as IQuanHuyen[];
                for (let i = 0; i < resQuanHuyen.length; i++) {
                    if (resQuanHuyen[i].tenquanhuyen.includes(data.admin_level_3)) {
                        objRes.idDistrict = resQuanHuyen[i].maquanhuyen;
                        objRes.nameDistrict = resQuanHuyen[i].tenquanhuyen;
                    }
                }
            } else {
                Toast.show("Error");
                return;
            }
        })
        .catch((err) => {
            if (__DEV__) {
                console.log("Err", err);
            }
        })

    await fetchPhuongXa(URL, objRes.idDistrict ?? "0")
        .then((res: any) => {
            if (res) {
                const resPhuongXa = res.data as IPhuongXa[];

                for (let i = 0; i < resPhuongXa.length; i++) {
                    if (resPhuongXa[i].tenphuongxa.includes(data.admin_level_4)) {
                        objRes.idWard = resPhuongXa[i].maphuongxa;
                        objRes.nameWard = resPhuongXa[i].tenphuongxa;
                    }
                }
            } else {
                Toast.show("Error");
                return;
            }
        })
        .catch((err) => {
            if (__DEV__) {
                console.log("Err", err);
            }
        })
    objRes.latitude = data.latitude;
    objRes.longitude = data.longitude;


    return objRes;
}

export interface IResultAddComponent {
    idDistrict?: string,
    nameDistrict?: string,
    idWard?: string,
    nameWard?: string,
    street?: string,
    housenumber?: string,
    latitude?: number,
    longitude?: number,
}