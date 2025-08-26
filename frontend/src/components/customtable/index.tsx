import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CustomTableProps } from "../../schema/props";

const CustomTable = <T extends object>({
    columns,
    data,
    loading = false,
    serialNumberConfig = { show: false, name: "Sr. No." },
    onPageChange,
}: CustomTableProps<T>) => {
    const processedData = serialNumberConfig.show
        ? data.map((item, index) => ({
            ...item,
            key: (item as any)?.id ?? index,
            rowIndex: index + 1,
        }))
        : data.map((item, index) => ({
            ...item,
            key: (item as any)?.id ?? index,
        }));
    const centeredColumns = columns.map((col) => ({
        ...col,
        align: col.align || 'center',
    }));
    const finalColumns: ColumnsType<any> = serialNumberConfig.show
        ? [
            {
                title: serialNumberConfig.name ?? "Sr. No.",
                dataIndex: "rowIndex",
                key: "rowIndex",
                align: "center",
                width: 60,
            },
            ...centeredColumns,
        ]
        : centeredColumns;

    return (
        <Table
            columns={finalColumns}
            dataSource={processedData}
            loading={loading}
            pagination={{
                pageSize: 10,
                onChange: onPageChange,
            }}
            rowKey={(record) => record.key}
            scroll={{ x: 'max-content' }}
            className="w-full md:w-screen shadow-md rounded-lg"
            tableLayout="auto"
        />
    );
};

export default CustomTable;