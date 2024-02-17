import { useFrame, useThree } from "@react-three/fiber";
import { useCursorContext } from "../context/CursorContext";
import { RefObject, useEffect, useState } from "react";
import * as THREE from "three";
import { useFldMapContext } from "../context/FldMapContext";

const raycaster = new THREE.Raycaster();

export const useCursorCapture = (meshRef: RefObject<THREE.Mesh>) => {
    const { camera, pointer, gl } = useThree();
    const { hoveredPoint, setHoveredPoint, setMeshPoint } = useCursorContext();
    const { fldFile } = useFldMapContext();

    const [lastIndex, setLastIndex] = useState<number>();
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [lastCamX, setLastCamX] = useState(0);
    const [lastCamZ, setLastCamZ] = useState(0);
    const [isMouseOver, setIsMouseOver] = useState(false);

    useFrame(() => {
        if (!isMouseOver) {
            if (hoveredPoint !== undefined) {
                setHoveredPoint(undefined);
                setMeshPoint(undefined);
            }
            return;
        }

        if (
            lastX === pointer.x &&
            lastY === pointer.y &&
            camera.position.x === lastCamX &&
            camera.position.z === lastCamZ
        ) {
            return;
        }

        setLastX(pointer.x);
        setLastY(pointer.y);
        setLastCamX(camera.position.x);
        setLastCamZ(camera.position.z);

        if (meshRef.current && fldFile) {
            const { height, width, points } = fldFile;
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObject(meshRef.current);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const x = Math.round(point.x);
                const z = Math.round(point.z);
                const index = (height - x) * width + z - width;
                if (index !== lastIndex && index < points.length) {
                    setMeshPoint({ x, z, value: Math.round(point.y) });
                    setHoveredPoint(index);
                    setLastIndex(index);
                }
            } else {
                if (hoveredPoint !== undefined) {
                    setHoveredPoint(undefined);
                    setMeshPoint(undefined);
                }
            }
        }
    });

    useEffect(() => {
        const handleMouseEnter = () => setIsMouseOver(true);
        const handleMouseLeave = () => setIsMouseOver(false);

        gl.domElement.addEventListener("mouseenter", handleMouseEnter);
        gl.domElement.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            gl.domElement.removeEventListener("mouseenter", handleMouseEnter);
            gl.domElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [gl]);
};
