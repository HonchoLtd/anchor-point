import { modeAtom } from '@src/stores';
import { useAtomValue } from 'jotai';

const Model = () => {
    const mode = useAtomValue(modeAtom)
    return {
        mode,
    };
};

export default Model;