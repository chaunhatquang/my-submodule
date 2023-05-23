import axios from "axios";

let config = require("../Config/config.json");
const headers = {
    token: config.TOKEN_SOHOA,
}

///create config axios
export const SoHoaClient = axios.create({
    baseURL: config.BASE_URL,
    headers: headers,
    timeout: 10000 //10s
})

export const Map4DClient = axios.create({
    baseURL: config.MAP4D_URL,
    timeout: 5000 //5s
})

export function fetchData<T>(
    url: string,
    params: any
) {
    return new Promise<T | null>(resolve => {
        SoHoaClient
            .post<T>(url + 'danhsach', params, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

export function updateData<T>(
    url: string,
    formData: FormData
) {
    const headers = {
        token: config.TOKEN_SOHOA,
        "Content-Type": "multipart/form-data"
    }
    return new Promise<T | null>(resolve => {
        SoHoaClient
            .post<T>(url + 'capnhat', formData, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}
export function updateDataWithField<T>(
    url: string,
    formData: FormData
) {
    const headers = {
        token: config.TOKEN_SOHOA,
        "Content-Type": "multipart/form-data"
    }
    return new Promise<T | null>(resolve => {
        SoHoaClient
            .post<T>(url + 'capnhattruong', formData, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

export function deleteData<T>(
    url: string,
    bodyParmas: any
) {
    const headers = {
        token: config.TOKEN_SOHOA,
    }
    return new Promise<T | null>(resolve => {
        SoHoaClient
            .post<T>(url + 'xoa', bodyParmas, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

export function dataDetail<T>(
    url: string,
    bodyParmas: any
) {
    const headers = {
        token: config.TOKEN_SOHOA,
    }
    return new Promise<T | null>(resolve => {
        SoHoaClient
            .post<T>(url + 'chitiet', bodyParmas, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

export function getAddress<T>(
    url: string,
    bodyParmas: any
) {
    return new Promise<T | null>(resolve => {
        Map4DClient
            .get<T>(url + 'v2/geocode', { params: bodyParmas })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

///fetch danh sach phuong/xa
export function fetchPhuongXa<T>(
    url: string,
    idQuanHuyen: string
) {
    return new Promise<T | null>(resolve => {
        const paramsPhuongXa = {
            "serviceid": "webU5kJZTNmhG3pmHdXEVw==",
            "thamso": {
                "tukhoa": "",
                "matinhthanh": "46",  ///46: Thua Thien Hue
                "maquanhuyen": idQuanHuyen
            },
            "page": "1",
            "perpage": "50"
        }

        SoHoaClient
            .post<T>(url + 'danhsach', paramsPhuongXa, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

///fetch danh sach quan/huyen
export function fetchQuanHuyen<T>(
    url: string,
) {
    return new Promise<T | null>(resolve => {
        const paramsQuanHuyen = {
            "serviceid": "zn4uk2KOsSPAXh5ZWSHgjw==",
            "thamso": {
                "tukhoa": "",
                "matinhthanh": "46"  ///46: Thua Thien Hue
            },
            "page": "1",
            "perpage": "50"
        }
        SoHoaClient
            .post<T>(url + 'danhsach', paramsQuanHuyen, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

///fetch danh sach thon/to
export function fetchThonTo<T>(
    url: string,
    idPhuongXa: any
) {
    return new Promise<T | null>(resolve => {
        const paramsThonTo = {
            "serviceid": "V8jem5O+a15frcJcBk+QJA==",
            "thamso": {
                "tukhoa": "",
                "matinhthanh": "46",
                "maphuongxa": idPhuongXa
            },
            "page": "1",
            "perpage": "500"
        }
        SoHoaClient
            .post<T>(url + 'danhsach', paramsThonTo, { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

//cay don vi
export function fetchCayDonVi<T>(
    url: string,
) {
    return new Promise<T | null>(resolve => {
        const paramsCayDonVi = {
            khoi: 3,
            cap: 1,
            nhomlh: 3,
            captt: 1
        }
        SoHoaClient
            .get<T>(url + 'madinhdanh', { headers: headers, params: paramsCayDonVi })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}

//Thong tin tai khoan
export function fetchThongTinTaiKhoan<T>(
    url: string,
    token: string
) {
    return new Promise<T | null>(resolve => {
        const headers = {
            token: token,
        }
        SoHoaClient
            .get<T>(url + 'thongtintaikhoan', { headers: headers })
            .then(response => {
                var allData = response.data;
                resolve(allData);
            })
            .catch(error => {
                if (__DEV__) {
                    console.log(error, 'err:', url);
                }
                resolve(null);
            });
    });
}









