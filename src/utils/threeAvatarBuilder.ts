import * as THREE from 'three';
import { Product, UserBodyMeasurements } from '../types';

export interface AvatarFitConfig {
  product: Product;
  userMeasurements: UserBodyMeasurements;
  activeSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  viewMode: 'fabric' | 'heatmap' | 'xray';
  showCalipers: boolean;
}

/**
 * Three.js 3D Avatar and Fitted Garment Scene Builder
 * Constructs a physically proportioned 3D mannequin matching the user's exact
 * shoulder width, chest circumference, and torso length, wearing the selected
 * garment with realistic ease drape, fabric tension, and collar details.
 */
export class ThreeAvatarStudio {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLDivElement;
  private animFrameId: number | null = null;

  // 3D Object Groups
  public modelRoot: THREE.Group;
  private bodyGroup: THREE.Group;
  private garmentGroup: THREE.Group;
  private calipersGroup: THREE.Group;
  private podiumGroup: THREE.Group;

  // Materials Cache
  private mannequinMaterial!: THREE.MeshStandardMaterial;
  private fabricMaterial!: THREE.MeshStandardMaterial;
  private heatmapMaterial!: THREE.MeshStandardMaterial;
  private xrayMaterial!: THREE.MeshPhysicalMaterial;

  // Lighting
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;

  // Current State
  private config: AvatarFitConfig;
  public targetRotationY: number = 0;
  public targetRotationX: number = 0;
  public zoomDistance: number = 5.2;

  constructor(container: HTMLDivElement, config: AvatarFitConfig) {
    this.container = container;
    this.config = config;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 520;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0.1, this.zoomDistance);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    // 4. Root Groups
    this.modelRoot = new THREE.Group();
    this.bodyGroup = new THREE.Group();
    this.garmentGroup = new THREE.Group();
    this.calipersGroup = new THREE.Group();
    this.podiumGroup = new THREE.Group();

    this.modelRoot.add(this.bodyGroup);
    this.modelRoot.add(this.garmentGroup);
    this.modelRoot.add(this.calipersGroup);

    this.scene.add(this.modelRoot);
    this.scene.add(this.podiumGroup);

    // 5. Lighting Setup (Fashion Studio Lighting)
    this.setupLighting();

    // 6. Materials
    this.setupMaterials();

    // 7. Build Podium Floor
    this.buildPodium();

    // 8. Build 3D Mannequin Body & Garment
    this.rebuildModel();

    // 9. Start Render Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  private setupLighting(): void {
    // Soft Ambient
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(this.ambientLight);

    // Key Light (Upper Front-Right with soft shadow)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    this.keyLight.position.set(3, 4.5, 3.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 15;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Fill Light (Upper Front-Left)
    this.fillLight = new THREE.DirectionalLight(0xf1f5f9, 0.65);
    this.fillLight.position.set(-3, 3, 2.5);
    this.scene.add(this.fillLight);

    // Rim Light (Back Edge to highlight garment silhouette)
    this.rimLight = new THREE.DirectionalLight(0xffd5e0, 0.9);
    this.rimLight.position.set(0, 3, -4);
    this.scene.add(this.rimLight);
  }

  private setupMaterials(): void {
    // Realistic Warm Porcelain Studio Mannequin
    this.mannequinMaterial = new THREE.MeshStandardMaterial({
      color: 0xeadccf,
      roughness: 0.45,
      metalness: 0.05,
    });

    // Realistic Product Fabric Material
    const baseColor = new THREE.Color(this.config.product.colorHex || '#202938');
    this.fabricMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.65,
      metalness: 0.08,
      bumpScale: 0.03,
    });

    // Tension Heatmap Material
    this.heatmapMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.5,
      metalness: 0.1,
    });

    // X-Ray / Clearance Transparency Material
    this.xrayMaterial = new THREE.MeshPhysicalMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.55,
      transmission: 0.4,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.5,
    });
  }

  private buildPodium(): void {
    while (this.podiumGroup.children.length > 0) {
      this.podiumGroup.remove(this.podiumGroup.children[0]);
    }

    // Modern studio circular podium
    const podiumGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.12, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.15,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -1.7;
    podium.receiveShadow = true;
    this.podiumGroup.add(podium);

    // Inner Metallic Ring in Brand Pink
    const ringGeo = new THREE.TorusGeometry(1.28, 0.015, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff3f6c,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.63;
    this.podiumGroup.add(ring);

    // Floor Shadow Receiver Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.71;
    shadowPlane.receiveShadow = true;
    this.podiumGroup.add(shadowPlane);
  }

  /**
   * Rebuilds the 3D Body and 3D Garment based on exact user measurements
   * and product sizing parameters.
   */
  public rebuildModel(): void {
    // Clear existing meshes
    this.clearGroup(this.bodyGroup);
    this.clearGroup(this.garmentGroup);
    this.clearGroup(this.calipersGroup);

    const { userMeasurements, product, activeSize, viewMode, showCalipers } = this.config;
    const isFemale = product.category === 'women' || product.category === 'ethnic';
    const isBottomWear = ['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType);

    // Convert measurements to inches
    const userChest = userMeasurements.unit === 'cm' ? userMeasurements.chest / 2.54 : userMeasurements.chest;
    const userShoulder = userMeasurements.unit === 'cm' ? userMeasurements.shoulder / 2.54 : userMeasurements.shoulder;
    const userLength = userMeasurements.unit === 'cm' ? userMeasurements.frontLength / 2.54 : userMeasurements.frontLength;

    // Garment spec for current size
    const garmentSpec = product.sizeChart.find((s) => s.size === activeSize) || product.sizeChart[2];
    const garmentChest = garmentSpec.chest || userChest;
    const garmentShoulder = garmentSpec.shoulder || userShoulder;
    const garmentLength = garmentSpec.length || userLength;

    // Clearance (Ease)
    const chestEase = isBottomWear ? (garmentSpec.waist || 0) - (userMeasurements.waist || 0) : garmentChest - userChest;
    const shoulderEase = isBottomWear ? 0 : garmentShoulder - userShoulder;
    const lengthDiff = garmentLength - userLength;

    // World units conversion: 1 inch = 0.055 Three.js units
    const INCH = 0.055;

    // Proportions
    const bodyShoulderHalf = (userShoulder * INCH) / 2; // e.g. 17" -> 0.467
    // Female bodies generally have a larger chest-to-underbust ratio
    const bodyChestRadiusX = (userChest * INCH) / (Math.PI * (isFemale ? 1.75 : 1.85)); // width
    const bodyChestRadiusZ = bodyChestRadiusX * (isFemale ? 0.75 : 0.65); // depth
    const bodyTorsoHeight = userLength * INCH * 0.88; // height from clavicle to hip
    const clavicleY = 0.65;

    // --- 1. BUILD 3D ANATOMICAL BODY MANNEQUIN ---
    this.buildBodyMannequin({
      bodyShoulderHalf,
      bodyChestRadiusX,
      bodyChestRadiusZ,
      bodyTorsoHeight,
      clavicleY,
      isFemale,
    });

    // --- 2. BUILD 3D FITTED GARMENT ---
    this.buildFittedGarment({
      userShoulderHalf: bodyShoulderHalf,
      userChestRadiusX: bodyChestRadiusX,
      userChestRadiusZ: bodyChestRadiusZ,
      userTorsoHeight: bodyTorsoHeight,
      clavicleY,
      garmentChest,
      garmentShoulder,
      garmentLength,
      chestEase,
      shoulderEase,
      lengthDiff,
      INCH,
      viewMode,
      isFemale,
      isBottomWear,
    });

    // --- 3. BUILD 3D CALIPERS / MEASUREMENT HUD ---
    if (showCalipers) {
      this.buildCalipers({
        bodyShoulderHalf,
        bodyChestRadiusX,
        bodyTorsoHeight,
        clavicleY,
        userShoulder,
        userChest,
        garmentShoulder,
        garmentChest,
        chestEase,
      });
    }
  }

  /**
   * Constructs the sculpted 3D Mannequin Body
   */
  private buildBodyMannequin(p: {
    bodyShoulderHalf: number;
    bodyChestRadiusX: number;
    bodyChestRadiusZ: number;
    bodyTorsoHeight: number;
    clavicleY: number;
    isFemale?: boolean;
  }): void {
    const mat = this.mannequinMaterial;

    // Head
    const headGeo = new THREE.SphereGeometry(0.22, 32, 24);
    headGeo.scale(0.85, 1.15, 0.95);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.set(0, p.clavicleY + 0.48, 0.02);
    head.castShadow = true;
    this.bodyGroup.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.22, 24);
    const neck = new THREE.Mesh(neckGeo, mat);
    neck.position.set(0, p.clavicleY + 0.16, 0.01);
    neck.castShadow = true;
    this.bodyGroup.add(neck);

    // Sculpted Torso Mesh (Chest, Waist, Hips)
    // Points along spine
    const torsoSegments = 18;
    const torsoPoints: THREE.Vector3[] = [];
    const waistY = p.clavicleY - p.bodyTorsoHeight * 0.55;
    const hipY = p.clavicleY - p.bodyTorsoHeight;

    // Parametric Torso using Lofted Cylinders
    const chestGeo = new THREE.CylinderGeometry(
      p.bodyChestRadiusX * 0.95,
      p.bodyChestRadiusX * 0.82,
      p.bodyTorsoHeight * 0.5,
      32
    );
    chestGeo.scale(1, 1, p.bodyChestRadiusZ / p.bodyChestRadiusX);
    const chestMesh = new THREE.Mesh(chestGeo, mat);
    chestMesh.position.set(0, p.clavicleY - p.bodyTorsoHeight * 0.25, 0);
    chestMesh.castShadow = true;
    chestMesh.receiveShadow = true;
    this.bodyGroup.add(chestMesh);

    // Female Bust
    if (p.isFemale) {
      const bustGeo = new THREE.SphereGeometry(p.bodyChestRadiusX * 0.42, 24, 24);
      bustGeo.scale(1, 0.85, 1.1);
      
      const leftBust = new THREE.Mesh(bustGeo, mat);
      leftBust.position.set(-p.bodyChestRadiusX * 0.35, p.clavicleY - p.bodyTorsoHeight * 0.3, p.bodyChestRadiusZ * 0.6);
      leftBust.rotation.x = 0.2;
      leftBust.rotation.y = -0.15;
      leftBust.castShadow = true;
      this.bodyGroup.add(leftBust);

      const rightBust = new THREE.Mesh(bustGeo, mat);
      rightBust.position.set(p.bodyChestRadiusX * 0.35, p.clavicleY - p.bodyTorsoHeight * 0.3, p.bodyChestRadiusZ * 0.6);
      rightBust.rotation.x = 0.2;
      rightBust.rotation.y = 0.15;
      rightBust.castShadow = true;
      this.bodyGroup.add(rightBust);
    }

    // Waist / Pelvis
    const waistGeo = new THREE.CylinderGeometry(
      p.bodyChestRadiusX * 0.82,
      p.bodyChestRadiusX * 0.92,
      p.bodyTorsoHeight * 0.5,
      32
    );
    waistGeo.scale(1, 1, (p.bodyChestRadiusZ / p.bodyChestRadiusX) * 0.9);
    const waistMesh = new THREE.Mesh(waistGeo, mat);
    waistMesh.position.set(0, p.clavicleY - p.bodyTorsoHeight * 0.75, 0);
    waistMesh.castShadow = true;
    waistMesh.receiveShadow = true;
    this.bodyGroup.add(waistMesh);

    // Shoulder Caps
    const shoulderCapGeo = new THREE.SphereGeometry(0.1, 24, 16);
    shoulderCapGeo.scale(1.1, 0.9, 1);

    const leftShoulder = new THREE.Mesh(shoulderCapGeo, mat);
    leftShoulder.position.set(-p.bodyShoulderHalf, p.clavicleY - 0.02, 0);
    leftShoulder.castShadow = true;
    this.bodyGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderCapGeo, mat);
    rightShoulder.position.set(p.bodyShoulderHalf, p.clavicleY - 0.02, 0);
    rightShoulder.castShadow = true;
    this.bodyGroup.add(rightShoulder);

    // Left Arm (Upper arm + Forearm in relaxed pose)
    const upperArmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.46, 20);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, mat);
    leftUpperArm.position.set(-p.bodyShoulderHalf - 0.06, p.clavicleY - 0.26, 0);
    leftUpperArm.rotation.z = 0.16; // slightly flared
    leftUpperArm.castShadow = true;
    this.bodyGroup.add(leftUpperArm);

    const leftForearmGeo = new THREE.CylinderGeometry(0.062, 0.05, 0.44, 20);
    const leftForearm = new THREE.Mesh(leftForearmGeo, mat);
    leftForearm.position.set(-p.bodyShoulderHalf - 0.12, p.clavicleY - 0.66, 0.04);
    leftForearm.rotation.z = 0.14;
    leftForearm.rotation.x = -0.12;
    leftForearm.castShadow = true;
    this.bodyGroup.add(leftForearm);

    // Right Arm
    const rightUpperArm = new THREE.Mesh(upperArmGeo, mat);
    rightUpperArm.position.set(p.bodyShoulderHalf + 0.06, p.clavicleY - 0.26, 0);
    rightUpperArm.rotation.z = -0.16;
    rightUpperArm.castShadow = true;
    this.bodyGroup.add(rightUpperArm);

    const rightForearm = new THREE.Mesh(leftForearmGeo, mat);
    rightForearm.position.set(p.bodyShoulderHalf + 0.12, p.clavicleY - 0.66, 0.04);
    rightForearm.rotation.z = -0.14;
    rightForearm.rotation.x = -0.12;
    rightForearm.castShadow = true;
    this.bodyGroup.add(rightForearm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.045, 16, 16);
    handGeo.scale(1, 1.2, 0.5);

    const leftHand = new THREE.Mesh(handGeo, mat);
    leftHand.position.set(-p.bodyShoulderHalf - 0.14, p.clavicleY - 0.88, 0.08);
    leftHand.rotation.z = 0.14;
    leftHand.rotation.x = -0.12;
    leftHand.castShadow = true;
    this.bodyGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, mat);
    rightHand.position.set(p.bodyShoulderHalf + 0.14, p.clavicleY - 0.88, 0.08);
    rightHand.rotation.z = -0.14;
    rightHand.rotation.x = -0.12;
    rightHand.castShadow = true;
    this.bodyGroup.add(rightHand);

    // Legs / Thighs
    const thighLength = 0.55;
    const hipRadiusX = p.bodyChestRadiusX * (p.isFemale ? 1.05 : 0.92);
    const thighRadiusTop = hipRadiusX * 0.48;
    const thighRadiusBottom = p.isFemale ? 0.11 : 0.12;
    
    const thighGeo = new THREE.CylinderGeometry(thighRadiusTop, thighRadiusBottom, thighLength, 24);
    thighGeo.translate(0, -thighLength/2, 0);

    const leftThigh = new THREE.Mesh(thighGeo, mat);
    leftThigh.position.set(-hipRadiusX * 0.45, hipY + 0.05, p.isFemale ? 0.03 : 0);
    leftThigh.rotation.z = -0.05; // slight A-stance
    leftThigh.castShadow = true;
    this.bodyGroup.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, mat);
    rightThigh.position.set(hipRadiusX * 0.45, hipY + 0.05, p.isFemale ? 0.03 : 0);
    rightThigh.rotation.z = 0.05; // slight A-stance
    rightThigh.castShadow = true;
    this.bodyGroup.add(rightThigh);

    // Calves
    const calfLength = 0.55;
    const calfGeo = new THREE.CylinderGeometry(thighRadiusBottom, p.isFemale ? 0.07 : 0.08, calfLength, 24);
    calfGeo.translate(0, -calfLength/2, 0);

    const leftCalf = new THREE.Mesh(calfGeo, mat);
    leftCalf.position.set(-hipRadiusX * 0.45 - (thighLength * Math.sin(-0.05)), hipY - thighLength + 0.05, p.isFemale ? 0.03 : 0);
    leftCalf.castShadow = true;
    this.bodyGroup.add(leftCalf);

    const rightCalf = new THREE.Mesh(calfGeo, mat);
    rightCalf.position.set(hipRadiusX * 0.45 + (thighLength * Math.sin(0.05)), hipY - thighLength + 0.05, p.isFemale ? 0.03 : 0);
    rightCalf.castShadow = true;
    this.bodyGroup.add(rightCalf);

    // Feet
    const footGeo = new THREE.BoxGeometry(0.12, 0.08, 0.25);
    footGeo.translate(0, -0.04, 0.05);

    const leftFoot = new THREE.Mesh(footGeo, mat);
    leftFoot.position.set(-hipRadiusX * 0.45 - (thighLength * Math.sin(-0.05)), hipY - thighLength - calfLength + 0.05, p.isFemale ? 0.03 : 0);
    leftFoot.castShadow = true;
    this.bodyGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, mat);
    rightFoot.position.set(hipRadiusX * 0.45 + (thighLength * Math.sin(0.05)), hipY - thighLength - calfLength + 0.05, p.isFemale ? 0.03 : 0);
    rightFoot.castShadow = true;
    this.bodyGroup.add(rightFoot);

    // Chrome Base Rod connecting to Podium
    const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 16);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.9,
    });
    
    const leftRod = new THREE.Mesh(rodGeo, rodMat);
    leftRod.position.set(-hipRadiusX * 0.45 - (thighLength * Math.sin(-0.05)), hipY - thighLength - calfLength - 0.05, p.isFemale ? 0.03 : 0);
    leftRod.castShadow = true;
    this.bodyGroup.add(leftRod);

    const rightRod = new THREE.Mesh(rodGeo, rodMat);
    rightRod.position.set(hipRadiusX * 0.45 + (thighLength * Math.sin(0.05)), hipY - thighLength - calfLength - 0.05, p.isFemale ? 0.03 : 0);
    rightRod.castShadow = true;
    this.bodyGroup.add(rightRod);
  }

  /**
   * Constructs the 3D Garment Worn OVER the Mannequin Body
   */
  private buildFittedGarment(p: {
    userShoulderHalf: number;
    userChestRadiusX: number;
    userChestRadiusZ: number;
    userTorsoHeight: number;
    clavicleY: number;
    garmentChest: number;
    garmentShoulder: number;
    garmentLength: number;
    chestEase: number;
    shoulderEase: number;
    lengthDiff: number;
    INCH: number;
    viewMode: 'fabric' | 'heatmap' | 'xray';
    isFemale?: boolean;
    isBottomWear?: boolean;
  }): void {
    // Garment dimensions in 3D world units
    const garmentShoulderHalf = (p.garmentShoulder * p.INCH) / 2;
    // Ease buffer
    const easeBuffer = Math.max(-0.02, (p.chestEase * p.INCH) / (Math.PI * 2));
    
    // Pick Material based on View Mode
    let currentMat: THREE.Material = this.fabricMaterial;
    if (p.viewMode === 'xray') {
      currentMat = this.xrayMaterial;
    } else if (p.viewMode === 'heatmap') {
      currentMat = this.heatmapMaterial;
    }

    if (p.isBottomWear) {
      // Build Pants
      const hipY = p.clavicleY - p.userTorsoHeight;
      const waistGeo = new THREE.CylinderGeometry(
        p.userChestRadiusX * 0.85 + easeBuffer,
        p.userChestRadiusX * 0.95 + easeBuffer,
        0.3,
        32
      );
      waistGeo.scale(1, 1, (p.userChestRadiusZ / p.userChestRadiusX) * 0.9);
      const waistMesh = new THREE.Mesh(waistGeo, currentMat);
      waistMesh.position.set(0, hipY - 0.15, 0);
      waistMesh.castShadow = true;
      waistMesh.receiveShadow = true;
      this.garmentGroup.add(waistMesh);

      const pantsLength = (p.garmentLength * p.INCH) * 0.6; // Scale down length for visual fit on screen
      const legGeo = new THREE.CylinderGeometry(p.userChestRadiusX * 0.5 + easeBuffer * 0.5, p.userChestRadiusX * 0.35 + easeBuffer * 0.3, pantsLength, 24);
      legGeo.translate(0, -pantsLength / 2, 0);

      const leftLeg = new THREE.Mesh(legGeo, currentMat);
      leftLeg.position.set(-p.userChestRadiusX * 0.45, hipY - 0.3, p.isFemale ? 0.03 : 0);
      leftLeg.rotation.z = -0.05;
      leftLeg.castShadow = true;
      this.garmentGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, currentMat);
      rightLeg.position.set(p.userChestRadiusX * 0.45, hipY - 0.3, p.isFemale ? 0.03 : 0);
      rightLeg.rotation.z = 0.05;
      rightLeg.castShadow = true;
      this.garmentGroup.add(rightLeg);
      
      return;
    }

    // Base radii
    const garmentRadiusX = p.userChestRadiusX + easeBuffer + 0.015;
    const garmentRadiusZ = p.userChestRadiusZ + easeBuffer + 0.015;
    const garmentTotalLength = p.garmentLength * p.INCH * 0.9;

    // 1. Torso Garment Shell (Chest down to Hem)
    const segmentsY = 24;
    const segmentsRadial = 36;
    
    const garmentGeo = new THREE.CylinderGeometry(
      garmentRadiusX,
      garmentRadiusX * 1.03, // subtle flare at hem
      garmentTotalLength,
      segmentsRadial,
      segmentsY,
      true // open ended for neck and hem
    );
    
    garmentGeo.scale(1, 1, garmentRadiusZ / garmentRadiusX);

    // If female, manually deform the vertices of the cylinder to create bust space
    if (p.isFemale) {
      const pos = garmentGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        // y goes from garmentTotalLength/2 (top) to -garmentTotalLength/2 (bottom)
        const normalizedY = (y / garmentTotalLength) + 0.5; // 1 = top, 0 = bottom
        
        // Bust protrusion around normalizedY = 0.7
        if (normalizedY <= 0.95 && normalizedY >= 0.45 && pos.getZ(i) > 0) {
          const bustFactor = Math.sin((normalizedY - 0.45) * Math.PI / 0.5); 
          const scaleOut = 1 + (bustFactor * 0.45); // increased protrusion to fully cover bust
          pos.setZ(i, pos.getZ(i) * scaleOut);
          // Also slightly widen it so it doesn't clip on the sides of the bust
          const scaleX = 1 + (bustFactor * 0.1);
          pos.setX(i, pos.getX(i) * scaleX);
        }
      }
      garmentGeo.computeVertexNormals();
    }

    // Apply Vertex Colors if Heatmap is enabled
    if (p.viewMode === 'heatmap') {
      const colors: number[] = [];
      const pos = garmentGeo.attributes.position;
      const count = pos.count;

      // Determine fit color based on ease
      // Ideal: Green (0x10b981)
      // Snug: Amber (0xf59e0b)
      // Tight: Red (0xef4444)
      // Loose: Blue (0x3b82f6)
      let r = 0.06;
      let g = 0.72;
      let b = 0.5; // default emerald

      if (p.chestEase < 0.5) {
        if (this.config.product.stretchFactor === 'high-stretch') {
          r = 0.96;
          g = 0.62;
          b = 0.04; // stretch snug amber
        } else {
          r = 0.93;
          g = 0.26;
          b = 0.26; // tight red
        }
      } else if (p.chestEase > 4.2) {
        r = 0.23;
        g = 0.51;
        b = 0.96; // loose blue
      }

      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        // Chest height has highest tension
        const chestFactor = Math.sin(((y + garmentTotalLength / 2) / garmentTotalLength) * Math.PI);
        const vertexR = THREE.MathUtils.lerp(r * 0.8, r, chestFactor);
        const vertexG = THREE.MathUtils.lerp(g * 0.8, g, chestFactor);
        const vertexB = THREE.MathUtils.lerp(b * 0.8, b, chestFactor);
        colors.push(vertexR, vertexG, vertexB);
      }

      garmentGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    const garmentMesh = new THREE.Mesh(garmentGeo, currentMat);
    // Center at appropriate torso drop
    garmentMesh.position.set(0, p.clavicleY - garmentTotalLength / 2 + 0.03, 0);
    garmentMesh.castShadow = true;
    garmentMesh.receiveShadow = true;
    this.garmentGroup.add(garmentMesh);

    // 2. Collar Detail (Polo Collar / Mandarin / Crew / Button Placket)
    const collarGeo = new THREE.TorusGeometry(garmentRadiusX * 0.48, 0.024, 16, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.product.colorHex || '#1e293b').offsetHSL(0, 0, -0.05),
      roughness: 0.7,
      metalness: 0.1,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.rotation.x = Math.PI / 2 + 0.18;
    collar.position.set(0, p.clavicleY + 0.05, 0.03);
    collar.castShadow = true;
    this.garmentGroup.add(collar);

    // 3. Shoulder Yoke & Seams
    const yokeGeo = new THREE.BoxGeometry(garmentShoulderHalf * 2, 0.04, garmentRadiusZ * 1.6);
    const yoke = new THREE.Mesh(yokeGeo, currentMat);
    yoke.position.set(0, p.clavicleY - 0.01, 0);
    yoke.castShadow = true;
    this.garmentGroup.add(yoke);

    // 4. Left Sleeve (Drapes over upper arm)
    const sleeveLength = 0.28;
    const sleeveGeo = new THREE.CylinderGeometry(
      0.105 + easeBuffer * 0.4,
      0.095 + easeBuffer * 0.3,
      sleeveLength,
      24
    );
    const leftSleeve = new THREE.Mesh(sleeveGeo, currentMat);
    leftSleeve.position.set(-garmentShoulderHalf - 0.03, p.clavicleY - 0.14, 0);
    leftSleeve.rotation.z = 0.22;
    leftSleeve.castShadow = true;
    this.garmentGroup.add(leftSleeve);

    // Sleeve Hem Cuff
    const cuffGeo = new THREE.TorusGeometry(0.095 + easeBuffer * 0.3, 0.012, 12, 24);
    const leftCuff = new THREE.Mesh(cuffGeo, collarMat);
    leftCuff.position.set(-garmentShoulderHalf - 0.06, p.clavicleY - 0.26, 0);
    leftCuff.rotation.x = Math.PI / 2;
    leftCuff.rotation.y = 0.22;
    this.garmentGroup.add(leftCuff);

    // 5. Right Sleeve
    const rightSleeve = new THREE.Mesh(sleeveGeo, currentMat);
    rightSleeve.position.set(garmentShoulderHalf + 0.03, p.clavicleY - 0.14, 0);
    rightSleeve.rotation.z = -0.22;
    rightSleeve.castShadow = true;
    this.garmentGroup.add(rightSleeve);

    const rightCuff = new THREE.Mesh(cuffGeo, collarMat);
    rightCuff.position.set(garmentShoulderHalf + 0.06, p.clavicleY - 0.26, 0);
    rightCuff.rotation.x = Math.PI / 2;
    rightCuff.rotation.y = -0.22;
    this.garmentGroup.add(rightCuff);

    // 6. Bottom Hem Rolled Edge
    const bottomHemGeo = new THREE.TorusGeometry(garmentRadiusX * 1.03, 0.016, 12, 36);
    bottomHemGeo.scale(1, 1, garmentRadiusZ / garmentRadiusX);
    const bottomHem = new THREE.Mesh(bottomHemGeo, collarMat);
    bottomHem.rotation.x = Math.PI / 2;
    bottomHem.position.set(0, p.clavicleY - garmentTotalLength + 0.03, 0);
    bottomHem.castShadow = true;
    this.garmentGroup.add(bottomHem);
  }

  /**
   * 3D Calipers and Floating Dimension Markers
   */
  private buildCalipers(p: {
    bodyShoulderHalf: number;
    bodyChestRadiusX: number;
    bodyTorsoHeight: number;
    clavicleY: number;
    userShoulder: number;
    userChest: number;
    garmentShoulder: number;
    garmentChest: number;
    chestEase: number;
  }): void {
    const caliperMat = new THREE.LineBasicMaterial({
      color: 0xff3f6c,
      linewidth: 2,
    });

    const markerMat = new THREE.MeshBasicMaterial({ color: 0xff3f6c });

    // Shoulder Width Caliper Bar
    const shoulderY = p.clavicleY + 0.08;
    const shoulderPoints = [
      new THREE.Vector3(-p.bodyShoulderHalf, shoulderY, 0.15),
      new THREE.Vector3(p.bodyShoulderHalf, shoulderY, 0.15),
    ];
    const shoulderGeo = new THREE.BufferGeometry().setFromPoints(shoulderPoints);
    const shoulderLine = new THREE.Line(shoulderGeo, caliperMat);
    this.calipersGroup.add(shoulderLine);

    // Left & Right End Notches
    const notchGeo = new THREE.ConeGeometry(0.02, 0.04, 12);
    const leftNotch = new THREE.Mesh(notchGeo, markerMat);
    leftNotch.position.set(-p.bodyShoulderHalf, shoulderY, 0.15);
    leftNotch.rotation.z = Math.PI / 2;
    this.calipersGroup.add(leftNotch);

    const rightNotch = new THREE.Mesh(notchGeo, markerMat);
    rightNotch.position.set(p.bodyShoulderHalf, shoulderY, 0.15);
    rightNotch.rotation.z = -Math.PI / 2;
    this.calipersGroup.add(rightNotch);

    // Chest Level Dimension Ring
    const chestY = p.clavicleY - 0.25;
    const ringGeo = new THREE.RingGeometry(p.bodyChestRadiusX * 1.15, p.bodyChestRadiusX * 1.17, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const chestRing = new THREE.Mesh(ringGeo, ringMat);
    chestRing.rotation.x = Math.PI / 2;
    chestRing.position.set(0, chestY, 0);
    this.calipersGroup.add(chestRing);
  }

  public updateConfig(newConfig: Partial<AvatarFitConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.product) {
      const baseColor = new THREE.Color(newConfig.product.colorHex || '#202938');
      if (this.fabricMaterial) this.fabricMaterial.color = baseColor;
      if (this.xrayMaterial) this.xrayMaterial.color = baseColor;
    }
    this.rebuildModel();
  }

  public resize(): void {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Smooth orbital rotation interpolation
    this.modelRoot.rotation.y += (this.targetRotationY - this.modelRoot.rotation.y) * 0.1;
    this.modelRoot.rotation.x += (this.targetRotationX - this.modelRoot.rotation.x) * 0.1;

    // Smooth zoom interpolation
    this.camera.position.z += (this.zoomDistance - this.camera.position.z) * 0.1;

    this.renderer.render(this.scene, this.camera);
  }

  private clearGroup(group: THREE.Group): void {
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
      }
    }
  }

  public destroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.clearGroup(this.bodyGroup);
    this.clearGroup(this.garmentGroup);
    this.clearGroup(this.calipersGroup);
    this.clearGroup(this.podiumGroup);

    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
