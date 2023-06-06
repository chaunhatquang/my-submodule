import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, Text, View } from 'react-native';
import { ITrafficAccident } from '../../../define';

interface CustomFlatListProps<T> {
    renderItem: ListRenderItem<T>;
    fetchData: (page: number) => Promise<T[]>;
    keyword?: string;
}

const CustomFlatList = <T extends { id: number, tenvutainan: string }>({ renderItem, fetchData, keyword }: CustomFlatListProps<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);

    useEffect(() => {

        fetchNextData();
    }, [page]);

    const fetchNextData = async () => {
        if (isLoading || isEndReached) {
            return;
        }

        setIsLoading(true);

        const newData = await fetchData(page);

        if (newData && newData.length > 0) {
            setData((prevData) => [...prevData, ...newData]);
            setPage((prevPage) => prevPage + 1);
        } else {
            setIsEndReached(true);
        }

        setIsLoading(false);
    };

    const renderFooter = () => {
        if (isLoading && !isEndReached) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size="small" color="red" />
                </View>
            );
        }

        if (!isLoading && data.length > 0 && isEndReached) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <Text style={{ textAlign: 'center' }}>Đã đến cuối danh sách!</Text>
                </View>
            );
        }

        return null;
    };

    const renderEmpty = () => {
        if (!isLoading && data.length == 0)
            return <Text style={{ textAlign: 'center', marginTop: 24 }}>Chưa có dữ liệu</Text>
        return null;
    };

    return (
        <FlatList
            style={{ flex: 1 }}
            data={keyword ? data.filter(x => x.tenvutainan.toLowerCase().includes(keyword.toLocaleLowerCase())) : data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={fetchNextData}
            onEndReachedThreshold={1}
        />
    );
};

export default CustomFlatList;

export const CustomFlatList2 = <T extends { MaPhanAnh: string }>({ renderItem, fetchData }: CustomFlatListProps<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);

    useEffect(() => {
        fetchNextData();
    }, [page]);

    const fetchNextData = async () => {
        if (isLoading || isEndReached) {
            return;
        }

        setIsLoading(true);

        const newData = await fetchData(page);


        if (newData && newData.length > 0) {
            setData((prevData) => [...prevData, ...newData]);
            setPage((prevPage) => prevPage + 1);
        } else {
            setIsEndReached(true);
        }

        setIsLoading(false);
    };

    const renderFooter = () => {
        if (isLoading && !isEndReached) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size="small" color="red" />
                </View>
            );
        }

        return null;
    };

    const renderEmpty = () => {
        if (!isLoading && data.length == 0)
            return <Text style={{ textAlign: 'center', marginTop: 24 }}>Chưa có dữ liệu</Text>
        return null;
    };

    return (
        <FlatList
            style={{ flex: 1 }}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.MaPhanAnh.toString()}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={fetchNextData}
            onEndReachedThreshold={1}
        />
    );
};

