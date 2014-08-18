/// <reference path="../../../../core/_reference.d.ts" />

module Application.Media.Gallery {

    export class Picture {

    }

    export class StorageProvider {
        public getPictureList(): Array<Picture> {
            throw new Error('');
        }
    }

    export class GalleryStore {

        private database: any;

        initialize(): void {
            arango.Connection('');
        }
    }

}