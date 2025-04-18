const viewer = new PhotoSphereViewer.Viewer({
  container: document.getElementById('viewer'),
  panorama: 'panoramas/pano1.jpg',
  plugins: [
    [PhotoSphereViewer.MarkersPlugin]
  ],
  navbar: ['zoom', 'fullscreen'],
  defaultYaw: 0,
  mousewheel: true,
  moveSpeed: 1.5
});

const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

// Define navigation structure
const scenes = {
  'panoramas/pano1.jpg': {
    next: 'panoramas/pano2.jpg',
    angle: 0.3
  },
  'panoramas/pano2.jpg': {
    next: 'panoramas/pano3.jpg',
    angle: 1.5
  },
  'panoramas/pano3.jpg': {
    next: 'panoramas/pano1.jpg',
    angle: -1.2
  }
};

// Add initial hotspot
viewer.once('ready', () => {
  addPortal(viewer.getPanorama());
});

viewer.on('panorama-loaded', (e, pano) => {
  addPortal(pano);
});

function addPortal(panorama) {
  markersPlugin.clearMarkers();

  const config = scenes[panorama];
  if (!config) return;

  markersPlugin.addMarker({
    id: 'portal',
    longitude: config.angle,
    latitude: -0.35,
    html: '<div class="matterport-circle"></div>',
    width: 60,
    height: 60,
    anchor: 'center center',
    tooltip: 'Go to next view',
    data: { target: config.next }
  });
}

viewer.on('select-marker', (e) => {
  if (e.marker.data && e.marker.data.target) {
    viewer.setPanorama(e.marker.data.target, {
      transition: {
        duration: 1000,
        loader: true
      }
    });
  }
});
