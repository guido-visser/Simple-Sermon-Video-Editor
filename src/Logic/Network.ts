import wretch from "wretch";

const poll = () => {
    wretch("/poll")
        .get()
        .json((res) => {
            console.log(res);
            poll();
        })
        .catch((error) => {
            console.error(error);
            poll();
        });
};

poll();
