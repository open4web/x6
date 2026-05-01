import {toast} from "react-toastify";

export const useOrderPolling = (fetchData: any, setOrderDrawerOpen: any) => {

    const pollOrder = async (orderID: string) => {
        const maxRetries = 3;
        const interval = 2000;
        let attempts = 0;

        return new Promise<void>((resolve) => {

            const run = async () => {
                try {
                    await fetchData(`/v1/hlj/order/pos/${orderID}`, (res: any) => {

                        if (res.status === 1) {
                            toast.success("支付成功", {
                                position: "top-center",
                                autoClose: 3000
                            });

                            setOrderDrawerOpen(true);
                            return resolve();
                        }

                    }, "GET", {});
                } catch (e) {
                    console.error("轮询失败", e);
                }

                attempts++;

                if (attempts < maxRetries) {
                    setTimeout(run, interval);
                } else {
                    toast.warning("支付状态未确认，请在订单中查看", {
                        position: "top-center"
                    });
                    resolve();
                }
            };

            run();
        });
    };

    return {pollOrder};
};