import { UIManager } from 'react-native'


class AdropBannerController {
    protected tag: number = 0

    constructor(tag: number) {
        this.tag = tag
        return this
    }

    public load() {
        UIManager.dispatchViewManagerCommand(this.tag, 'load', [])
    }
}

export default AdropBannerController
